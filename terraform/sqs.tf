resource "aws_sqs_queue" "matching_queue" { 
    name = "matching.fifo" 
    fifo_queue = true
    content_based_deduplication = true
}