variable "routing_engine_url" {
    default = ""
}

variable "geocoding_engine_url" {
    default = ""
}

module "terraform_module" {
    source = "./terraform"
    routing_engine_url = var.routing_engine_url
    geocoding_engine_url = var.geocoding_engine_url
}

output "module_outputs" {
    value = module.terraform_module
}
