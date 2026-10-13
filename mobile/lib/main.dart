import "package:flutter/material.dart";

import "api.dart";
import "desk_home.dart";
import "store.dart";

void main() {
  runApp(LittleroyalsApp(api: SchoolApi()));
}

class LittleroyalsApp extends StatelessWidget {
  const LittleroyalsApp({super.key, required this.api});

  final SchoolApi api;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Little Royals",
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1E4B9B)),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        useMaterial3: true,
      ),
      home: LoginScreen(api: api),
    );
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key, required this.api});

  final SchoolApi api;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final email = TextEditingController(text: "grace.achieng@littleroyals.school");
  final password = TextEditingController();
  final host = TextEditingController();
  final store = SchoolStore();
  var busy = false;
  var error = "";

  @override
  void initState() {
    super.initState();
    host.text = widget.api.base;
    store.loadAsset();
  }

  @override
  void dispose() {
    email.dispose();
    password.dispose();
    host.dispose();
    super.dispose();
  }

  Future<void> submit() async {
    setState(() {
      busy = true;
      error = "";
    });
    if (!store.ready) {
      try {
        await store.loadAsset();
      } catch (_) {
        setState(() {
          busy = false;
          error = "The school register did not load.";
        });
        return;
      }
    }
    final localError = store.signIn(email.text.trim(), password.text);
    if (localError != null) {
      setState(() {
        busy = false;
        error = localError;
      });
      return;
    }
    widget.api.base = host.text.trim().replaceAll(RegExp(r"/+$"), "");
    try {
      await widget.api.login(email.text.trim(), password.text);
    } on ApiException catch (caught) {
      if (!caught.message.startsWith("Cannot reach")) {
        store.signOut();
        if (mounted) {
          setState(() {
            busy = false;
            error = caught.message;
          });
        }
        return;
      }
    }
    if (!mounted) return;
    await Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => DeskHome(
          store: store,
          onSignOut: (deskContext) {
            store.signOut();
            widget.api.token = null;
            Navigator.of(deskContext).pushReplacement(MaterialPageRoute(builder: (_) => LoginScreen(api: widget.api)));
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                children: [
                  Image.asset("assets/logo.png", height: 72),
                  const SizedBox(height: 16),
                  const Text("Welcome back to Little Royals", textAlign: TextAlign.center, style: TextStyle(fontSize: 26, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  const Text("Sign in to the school office for this term.", textAlign: TextAlign.center, style: TextStyle(color: Color(0xFF64748B))),
                  const SizedBox(height: 24),
                  TextField(controller: email, keyboardType: TextInputType.emailAddress, decoration: const InputDecoration(labelText: "Email", border: OutlineInputBorder())),
                  const SizedBox(height: 12),
                  TextField(controller: password, obscureText: true, decoration: const InputDecoration(labelText: "Password", border: OutlineInputBorder())),
                  const SizedBox(height: 12),
                  TextField(controller: host, decoration: const InputDecoration(labelText: "API address", border: OutlineInputBorder())),
                  if (error.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Text(error, style: const TextStyle(color: Color(0xFFE11D48))),
                  ],
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: const Color(0xFF1E4B9B), padding: const EdgeInsets.symmetric(vertical: 14), shape: const StadiumBorder()),
                      onPressed: busy ? null : submit,
                      child: Text(busy ? "Signing in" : "Log in"),
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text("Development password: school", style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
