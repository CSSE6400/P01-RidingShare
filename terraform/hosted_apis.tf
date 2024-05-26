data "aws_instance" "hosted_apis" {
	instance_id = "i-05a58ff6f808f8ebc"
}

resource "null_resource" "manage_hosted_apis_ec2" {
	triggers = {
		instance_id = data.aws_instance.hosted_apis.id
	}

	provisioner "local-exec" {
		command = "aws ec2 start-instances --instance-ids ${self.triggers.instance_id} && sleep 30"
	}

	provisioner "local-exec" {
		command = "aws ec2 stop-instances --instance-ids ${self.triggers.instance_id} && sleep 30"
		when    = destroy
	}
}

data "external" "hosted_apis_ip" {
	program = ["${path.module}/get_hosted_apis_ip.sh", "${data.aws_instance.hosted_apis.id}"]
	depends_on = [null_resource.manage_hosted_apis_ec2]
}

output "hosted_apis_ip" {
	value = data.external.hosted_apis_ip.result.value
}
