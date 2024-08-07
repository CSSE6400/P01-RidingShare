
resource "aws_ecs_cluster" "riding_share" { 
    name = "riding_share" 
}


resource "aws_security_group" "riding_share" { 
    name = "app" 
    description = "RidingShare Security Group" 

    ingress { 
        from_port = 8080 
        to_port = 8080 
        protocol = "tcp" 
        cidr_blocks = ["0.0.0.0/0"] 
    } 
 
    ingress { 
        from_port = 22 
        to_port = 22 
        protocol = "tcp" 
        cidr_blocks = ["0.0.0.0/0"] 
    } 

    egress { 
        from_port = 0 
        to_port = 0 
        protocol = "-1" 
        cidr_blocks = ["0.0.0.0/0"] 
    } 
}

# Application
resource "aws_ecs_task_definition" "app" { 
    family = "app" 
    network_mode = "awsvpc" 
    requires_compatibilities = ["FARGATE"] 
    cpu = 1024 
    memory = 2048 
    execution_role_arn = data.aws_iam_role.lab.arn 

    container_definitions = jsonencode([
        {
            name = "app"
            image = aws_ecr_repository.riding_share.repository_url
            cpu = 1024 
            memory = 2048 
            essential = true
            networkMode = "awsvpc"
            portMappings = [
                {
                    containerPort = 8080
                    hostPort = 8080
                }
            ]
            environment = [
                {
                    name = "CELERY_BROKER_URL"
                    value = "sqs://"
                },
                {
                    name = "SQLALCHEMY_DATABASE_URI"
                    value = "postgresql+psycopg://${var.database_username}:${var.database_password}@${aws_db_instance.riding_share_database.address}:${aws_db_instance.riding_share_database.port}/${aws_db_instance.riding_share_database.db_name}" 
                },
                {
                    name = "ROUTING_URL"
                    value = var.routing_engine_url
                },
                {
                    name = "GEOCODING_URL"
                    value = var.geocoding_engine_url
                }
            ]
            logConfiguration = {
                logDriver = "awslogs"
                options = {
                    awslogs-group = "/riding_share/trips"
                    awslogs-region = "us-east-1"
                    awslogs-stream-prefix =  "ecs"
                    awslogs-create-group = "true" 
                }
            }
        }
    ])
}

resource "aws_ecs_service" "app" { 
    name = "app" 
    cluster = aws_ecs_cluster.riding_share.id 
    task_definition = aws_ecs_task_definition.app.arn 
    desired_count = 1 
    launch_type = "FARGATE" 

    network_configuration { 
        subnets = data.aws_subnets.private.ids 
        security_groups = [aws_security_group.riding_share.id] 
        assign_public_ip = true 
    } 

    load_balancer { 
        target_group_arn = aws_lb_target_group.app.arn 
        container_name   = "app" 
        container_port   = 8080 
    }
}


# Celery Worker
resource "aws_ecs_task_definition" "matching_celery" { 
    family = "matching_celery" 
    network_mode = "awsvpc" 
    requires_compatibilities = ["FARGATE"] 
    cpu = 1024 
    memory = 2048 
    execution_role_arn = data.aws_iam_role.lab.arn 

    container_definitions = jsonencode([
        {
            name = "matching_celery"
            image = aws_ecr_repository.riding_share.repository_url
            command = ["celery", "--app", "tasks.celery_app", "worker", "--uid=nobody", "--gid=nogroup", "--loglevel=info", "-Q", "matching.fifo", "--autoscale=6,2"]
            cpu = 1024
            memory = 2048
            essential = true
            networkMode = "awsvpc"
            portMappings = [
                {
                    containerPort = 8080
                    hostPort = 8080
                }
            ]
            environment = [
                {
                    name = "CELERY_BROKER_URL"
                    value = "sqs://"
                },
                {
                    name = "SQLALCHEMY_DATABASE_URI"
                    value = "postgresql+psycopg://${var.database_username}:${var.database_password}@${aws_db_instance.riding_share_database.address}:${aws_db_instance.riding_share_database.port}/${aws_db_instance.riding_share_database.db_name}" 
                },
                {
                    name = "ROUTING_URL"
                    value = var.routing_engine_url
                },
                {
                    name = "GEOCODING_URL"
                    value = var.geocoding_engine_url
                }
            ]
            logConfiguration = {
                logDriver = "awslogs"
                options = {
                    awslogs-group = "/riding_share/worker"
                    awslogs-region = "us-east-1"
                    awslogs-stream-prefix =  "ecs"
                    awslogs-create-group = "true" 
                }
            }

        }
    ])
}

resource "aws_ecs_service" "matching_celery" { 
    name = "matching_celery" 
    cluster = aws_ecs_cluster.riding_share.id 
    task_definition = aws_ecs_task_definition.matching_celery.arn 
    desired_count = 1 
    launch_type = "FARGATE" 

    network_configuration { 
        subnets = data.aws_subnets.private.ids 
        security_groups = [aws_security_group.riding_share.id] 
        assign_public_ip = true 
    } 
}