variable "routing_engine_url" {
    default = ""
}

variable "geocoding_engine_url" {
    default = ""
}

locals {
    routing_url = "${var.routing_engine_url == "" ? data.external.hosted_routing_ip.result.value   : var.routing_engine_url}"
    geocoding_url = "${var.geocoding_engine_url == "" ? data.external.hosted_geocoding_ip.result.value : var.geocoding_engine_url}"
}