data "aws_instance" "hosted_apis" {
	instance_id = "i-02a8dbbc2fca299a6" #TODO: Needs to be changed, currently wrong
}

resource "null_resource" "manage_hosted_apis_ec2" {
	triggers = {
		instance_id = data.aws_instance.hosted_apis.id
	}

	provisioner "local-exec" {
		command = "aws ec2 start-instances --instance-ids ${self.triggers.instance_id}"
	}

	provisioner "local-exec" {
		command = "aws ec2 stop-instances --instance-ids ${self.triggers.instance_id}"
		when    = destroy
	}
}
