resource "aws_apigatewayv2_api" "http_api" {
  name          = "todo-http-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [
      "http://localhost:5173",       # dev site
      "https://your-prod-domain.com" # add prod domain later
    ]
    allow_methods     = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers     = ["Content-Type", "Authorization"]
    allow_credentials = false # set true only if you’ll send cookies
    max_age           = 3600  # seconds browser can cache preflight
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

# CreateTask integration
resource "aws_apigatewayv2_integration" "create_task" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.create_task.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "create_task" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /tasks"
  target    = "integrations/${aws_apigatewayv2_integration.create_task.id}"
}

resource "aws_lambda_permission" "create_task" {
  statement_id  = "AllowAPIGatewayInvokeCreate"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_task.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# GetTasks integration
resource "aws_apigatewayv2_integration" "get_tasks" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_tasks.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_tasks" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /tasks"
  target    = "integrations/${aws_apigatewayv2_integration.get_tasks.id}"
}

resource "aws_lambda_permission" "get_tasks" {
  statement_id  = "AllowAPIGatewayInvokeGet"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_tasks.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# UpdateTask integration
resource "aws_apigatewayv2_integration" "update_task" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.update_task.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "update_task" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "PUT /tasks/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.update_task.id}"
}

resource "aws_lambda_permission" "update_task" {
  statement_id  = "AllowAPIGatewayInvokeUpdate"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.update_task.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# DeleteTask integration
resource "aws_apigatewayv2_integration" "delete_task" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.delete_task.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "delete_task" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "DELETE /tasks/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.delete_task.id}"
}

resource "aws_lambda_permission" "delete_task" {
  statement_id  = "AllowAPIGatewayInvokeDelete"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_task.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

