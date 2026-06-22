"""
核心指标 API 路由
"""
from flask import Blueprint, request, jsonify
from data.generator import get_core_metrics, get_annual_trend, get_policy_nodes

metrics_bp = Blueprint('metrics', __name__)


@metrics_bp.route('/api/metrics', methods=['GET'])
def core_metrics():
    year = request.args.get('year', default=2024, type=int)
    return jsonify(get_core_metrics(year))


@metrics_bp.route('/api/trend', methods=['GET'])
def annual_trend():
    start_year = request.args.get('startYear', default=2015, type=int)
    end_year = request.args.get('endYear', default=2024, type=int)
    return jsonify(get_annual_trend(start_year, end_year))


@metrics_bp.route('/api/policies', methods=['GET'])
def policies():
    return jsonify(get_policy_nodes())
