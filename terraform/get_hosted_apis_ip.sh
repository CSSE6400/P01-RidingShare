#!/bin/bash

output=$(aws ec2 describe-instances \
--filters \
"Name=instance-state-name,Values=running" \
"Name=instance-id,Values=$1" \
--query "Reservations[*].Instances[*].[PublicIpAddress]" \
--output text)

echo "{\"value\": \"$output\"}" | jq .
