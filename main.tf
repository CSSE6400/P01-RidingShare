module "terraform_module" {
    source = "./terraform"
}

output "module_outputs" {
  value = module.terraform_module
}
