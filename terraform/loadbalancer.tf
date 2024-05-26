resource "aws_lb_target_group" "app" { 
    name          = "app" 
    port          = 8080 
    protocol      = "HTTP" 
    vpc_id        = aws_security_group.riding_share.vpc_id 
    target_type   = "ip" 

    health_check { 
        enabled = true
        path                = "/api/v1/health" 
        port                = "8080" 
        protocol            = "HTTP" 
        healthy_threshold   = 2 
        unhealthy_threshold = 2 
        timeout             = 5 
        interval            = 10 
    }
}

resource "aws_lb" "riding_share" { 
    name               = "ridingshare" 
    internal           = false 
    load_balancer_type = "application" 
    subnets            = data.aws_subnets.private.ids 
    security_groups    = [aws_security_group.load_balancer.id]
} 


resource "aws_security_group" "load_balancer" { 
    name        = "load_balancer" 
    description = "RidingShare Security Group" 

    ingress { 
        from_port     = 80 
        to_port       = 80 
        protocol      = "tcp" 
        cidr_blocks   = ["0.0.0.0/0"] 
    } 

    egress { 
        from_port     = 0 
        to_port       = 0 
        protocol      = "-1" 
        cidr_blocks   = ["0.0.0.0/0"] 
    } 
}

resource "aws_lb_listener" "app_http" { 
    load_balancer_arn   = aws_lb.riding_share.arn 
    port                = "80" 
    protocol            = "HTTP" 
 
    default_action { 
        type              = "forward" 
        target_group_arn  = aws_lb_target_group.app.arn 
    } 
}

resource "aws_lb_listener" "app" { 
    load_balancer_arn   = aws_lb.riding_share.arn 
    port                = "443" 
    protocol            = "HTTPS" 

    certificate_arn = "arn:aws:acm:us-east-1:590183807676:certificate/336a8af4-2190-4605-a19a-2adab8363c14"
 
    default_action { 
        type              = "forward" 
        target_group_arn  = aws_lb_target_group.app.arn 
    } 
}