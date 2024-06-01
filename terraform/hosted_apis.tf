data "aws_instance" "hosted_apis" {
    instance_id = "i-05a58ff6f808f8ebc"
}

resource "null_resource" "manage_hosted_apis_ec2" {
    triggers = {
        instance_id = data.aws_instance.hosted_apis.id
        routing_engine_url = var.routing_engine_url
        geocoding_engine_url = var.geocoding_engine_url
    }

    provisioner "local-exec" {
        command = "${(self.triggers.routing_engine_url == "" || self.triggers.geocoding_engine_url == "") ? "aws ec2 start-instances --instance-ids ${self.triggers.instance_id} && sleep 30" : "echo"}"
    }

    provisioner "local-exec" {
        command = "${(self.triggers.routing_engine_url == "" || self.triggers.geocoding_engine_url == "") ? "aws ec2 stop-instances --instance-ids ${self.triggers.instance_id} && sleep 30" : "echo"}"
        when    = destroy
    }
}

data "external" "hosted_routing_ip" {
    program = ["${path.module}/get_hosted_apis_ip.sh", "${data.aws_instance.hosted_apis.id}", "5000"]
    depends_on = [null_resource.manage_hosted_apis_ec2]
}

data "external" "hosted_geocoding_ip" {
    program = ["${path.module}/get_hosted_apis_ip.sh", "${data.aws_instance.hosted_apis.id}", "8080"]
    depends_on = [null_resource.manage_hosted_apis_ec2]
}
