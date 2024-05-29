# Application Scaling
resource "aws_appautoscaling_target" "app" { 
    max_capacity        = 4 
    min_capacity        = 1 
    resource_id         = "service/riding_share/app" 
    scalable_dimension  = "ecs:service:DesiredCount" 
    service_namespace   = "ecs" 
    depends_on = [ aws_ecs_service.app ]
} 

resource "aws_appautoscaling_policy" "app-lb" { 
    name                = "app-lb" 
    policy_type         = "TargetTrackingScaling" 
    resource_id         = aws_appautoscaling_target.app.resource_id 
    scalable_dimension  = aws_appautoscaling_target.app.scalable_dimension 
    service_namespace   = aws_appautoscaling_target.app.service_namespace 

    target_tracking_scaling_policy_configuration { 
        target_value               = 500

        predefined_metric_specification { 
            predefined_metric_type = "ALBRequestCountPerTarget"
            resource_label         = "${aws_lb.riding_share.arn_suffix}/${aws_lb_target_group.app.arn_suffix}"      
        } 
    } 
}


# Matching Worker Scaling
resource "aws_appautoscaling_target" "matching_worker" { 
    max_capacity        = 4 
    min_capacity        = 1 
    resource_id         = "service/riding_share/matching_celery" 
    scalable_dimension  = "ecs:service:DesiredCount" 
    service_namespace   = "ecs" 
    depends_on = [ aws_ecs_service.app ]
}

resource "aws_appautoscaling_policy" "matching-queue_size" { 
    name                = "app-lb" 
    policy_type         = "TargetTrackingScaling" 
    resource_id         = aws_appautoscaling_target.matching_worker.resource_id 
    scalable_dimension  = aws_appautoscaling_target.matching_worker.scalable_dimension 
    service_namespace   = aws_appautoscaling_target.matching_worker.service_namespace 

    target_tracking_scaling_policy_configuration { 
        target_value = 100

        customized_metric_specification {
          metrics {
            label = "Queue Size"
            id    = "m1"
            metric_stat {
                metric {
                    metric_name = "ApproximateNumberOfMessagesVisible"
                    namespace   = "AWS/SQS"   

                    dimensions {
                        name  = "QueueName"
                        value = "matching.fifo"
                    }  
                }
                stat = "Average"
            }
            return_data = true
          }
        }
    } 
}