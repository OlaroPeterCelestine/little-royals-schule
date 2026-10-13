import "dart:convert";
import "dart:io";

import "package:http/http.dart" as http;

class ApiException implements Exception {
  ApiException(this.message);
  final String message;

  @override
  String toString() => message;
}

class SchoolApi {
  SchoolApi({String? base}) : base = base ?? defaultBase();

  String base;
  String? token;

  static String defaultBase() {
    if (Platform.isAndroid) return "http://10.0.2.2:8080";
    return "http://127.0.0.1:8080";
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final body = await _send("POST", "/v1/login", payload: {"email": email, "password": password}, auth: false);
    token = body["token"] as String?;
    return body;
  }

  Future<Map<String, dynamic>> dashboard() {
    return _send("GET", "/v1/dashboard");
  }

  Future<List<Map<String, dynamic>>> students() async {
    final body = await _send("GET", "/v1/students");
    return _rows(body["students"]);
  }

  Future<Map<String, dynamic>> student(String id) {
    return _send("GET", "/v1/students/$id");
  }

  Future<Map<String, dynamic>> _send(String method, String path, {Map<String, dynamic>? payload, bool auth = true}) async {
    final uri = Uri.parse("$base$path");
    final headers = <String, String>{"Content-Type": "application/json"};
    if (auth && token != null) headers["Authorization"] = "Bearer $token";
    late http.Response response;
    try {
      response = await (method == "POST"
          ? http.post(uri, headers: headers, body: jsonEncode(payload ?? {}))
          : http.get(uri, headers: headers));
    } on SocketException {
      throw ApiException("Cannot reach the school API at $base.");
    }
    final decoded = response.body.isEmpty ? <String, dynamic>{} : jsonDecode(response.body);
    if (decoded is! Map) {
      throw ApiException("The school API returned an unexpected response.");
    }
    final body = Map<String, dynamic>.from(decoded);
    if (response.statusCode >= 400) {
      throw ApiException(body["error"] as String? ?? "The school API rejected the request.");
    }
    return body;
  }

  List<Map<String, dynamic>> _rows(Object? value) {
    if (value is! List) return [];
    return [
      for (final item in value)
        if (item is Map) Map<String, dynamic>.from(item),
    ];
  }
}

String shillings(Object? value) {
  final amount = value is num ? value.round() : int.tryParse("$value") ?? 0;
  final negative = amount < 0;
  final digits = amount.abs().toString();
  final buffer = StringBuffer();
  for (var index = 0; index < digits.length; index++) {
    final remaining = digits.length - index;
    if (index > 0 && remaining % 3 == 0) buffer.write(",");
    buffer.write(digits[index]);
  }
  return "${negative ? "-" : ""}UGX $buffer";
}
