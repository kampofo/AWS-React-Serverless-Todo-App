output "http_api_url" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}

output "db_endpoint" {
  value = aws_db_instance.todo_postgres.endpoint
}
