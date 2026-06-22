"""
婚姻状况数据分析 Flask 应用入口
"""
from flask import Flask
from flask_cors import CORS

from routes.metrics_routes import metrics_bp
from routes.heatmap_routes import heatmap_bp
from routes.age_routes import age_bp
from routes.region_routes import region_bp
from routes.education_routes import education_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(metrics_bp)
app.register_blueprint(heatmap_bp)
app.register_blueprint(age_bp)
app.register_blueprint(region_bp)
app.register_blueprint(education_bp)


@app.route('/api/health')
def health_check():
    return {"status": "ok", "message": "Marriage Data API is running"}


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
