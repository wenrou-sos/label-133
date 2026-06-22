"""
教育程度 API 路由
"""
from flask import Blueprint, request, jsonify
from data.generator import get_education_data, get_education_correlation

education_bp = Blueprint('education', __name__)


@education_bp.route('/api/education', methods=['GET'])
def education_data():
    year = request.args.get('year', default=2024, type=int)
    return jsonify(get_education_data(year))


@education_bp.route('/api/education/correlation', methods=['GET'])
def education_correlation():
    return jsonify(get_education_correlation())
