"""
热力图 API 路由
"""
from flask import Blueprint, request, jsonify
from data.generator import get_heatmap_data

heatmap_bp = Blueprint('heatmap', __name__)


@heatmap_bp.route('/api/heatmap/marriage', methods=['GET'])
def marriage_heatmap():
    year = request.args.get('year', default=2024, type=int)
    return jsonify(get_heatmap_data(year, 'marriage'))


@heatmap_bp.route('/api/heatmap/divorce', methods=['GET'])
def divorce_heatmap():
    year = request.args.get('year', default=2024, type=int)
    return jsonify(get_heatmap_data(year, 'divorce'))
