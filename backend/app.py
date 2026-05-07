import os
from flask import Flask
from flask_cors import CORS
from routes.account_routes import account_bp
from routes.ai_routes import ai_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(account_bp, url_prefix='/api/accounts')
app.register_blueprint(ai_bp, url_prefix='/api/ai')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=False)    
 
