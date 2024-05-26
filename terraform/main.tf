data "aws_iam_role" "lab" { 
    name = "LabRole" 
} 
 
data "aws_vpc" "default" { 
    default = true 
} 
 
data "aws_subnets" "private" { 
    filter { 
        name = "vpc-id" 
        values = [data.aws_vpc.default.id] 
    } 
}


output "public_dns_name" {
    description = "Public DNS address of the load balancer listener"
    value 		= aws_lb.riding_share.dns_name
}