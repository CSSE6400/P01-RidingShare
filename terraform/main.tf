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

output "application_dns_name" {
    description = "DNS address of the application"
    value       = aws_lb.riding_share.dns_name
}

resource "local_file" "url" {
   content   = format("https://%s/", aws_lb.riding_share.dns_name)
    filename = "./application_url.txt"
}