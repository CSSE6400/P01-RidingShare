variable "database_username" {
    type      = string
    sensitive = true
    default   = "administrator"
}

variable "database_password" {
    type      = string
    sensitive = true
    default   = "verySecretPassword"
}

# Database
resource "aws_db_instance" "riding_share_database" {
    allocated_storage      = 20
    max_allocated_storage  = 100
    db_name                = "riding_share"
    engine                 = "postgres"
    engine_version         = "16"
    instance_class         = "db.t4g.micro"
    username               = var.database_username
    password               = var.database_password
    parameter_group_name   = "default.postgres16"
    skip_final_snapshot    = true
    vpc_security_group_ids = [aws_security_group.riding_share_database.id]
    publicly_accessible    = false

    tags = {
        Name = "riding_share_database"
    }
}

resource "aws_security_group" "riding_share_database" {
    name = "riding_share_database" 
    description = "Allow inbound Postgresql traffic" 

    ingress { 
        from_port   = 5432 
        to_port     = 5432 
        protocol    = "tcp" 
        cidr_blocks = ["0.0.0.0/0"] 
    } 

    egress { 
        from_port        = 0 
        to_port          = 0 
        protocol         = "-1" 
        cidr_blocks      = ["0.0.0.0/0"] 
        ipv6_cidr_blocks = ["::/0"] 
    } 

    tags = { 
        Name = "riding_share_database" 
    } 
}

# provider "postgresql" {
#     host             = aws_db_instance.riding_share_database.address
#     port             = aws_db_instance.riding_share_database.port
#     database         = "postgres"
#     username         = var.database_username
#     password         = var.database_password
#     sslmode          = "require"
#     expected_version = aws_db_instance.riding_share_database.engine_version
#     superuser        = false
# }

# # Installs postgres PostGIS extension
# resource "postgresql_extension" "postgis" {
#   name = "postgis"
# }