data "aws_ecr_authorization_token" "ecr_token" {} 

## RidingShare Application Repo
resource "aws_ecr_repository" "riding_share" { 
    name = "riding_share" 
}

resource "docker_image" "riding_share" { 
    name = "${aws_ecr_repository.riding_share.repository_url}:latest" 
    build { 
        context = "./application"
    } 
} 
 
resource "docker_registry_image" "riding_share" { 
    name = docker_image.riding_share.name 
}