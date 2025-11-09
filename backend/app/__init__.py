# ~/sanhaak/Sample/backend/routes/__init__.py
from flask import Flask

def create_app():
    app = Flask(__name__)

    from .routes.explain import explain_bp
    app.register_blueprint(explain_bp)

    return app
