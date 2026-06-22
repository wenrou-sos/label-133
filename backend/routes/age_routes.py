"""
年龄分布 API 路由
"""
from flask import Blueprint, request, jsonify
from data.generator import get_age_distribution

age_bp = Blueprint('age', __name__)


@age_bp.route('/api/age-distribution', methods=['GET'])
def age_distribution():
    year = request.args.get('year', default=2024, type=int)
    gender = request.args.get('gender', default=None, type=str)
    data = get_age_distribution(year)
    if gender:
        data = [d for d in data if d['gender'] == gender]
    return jsonify(data)
