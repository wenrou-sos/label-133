"""
地域对比 API 路由
"""
from flask import Blueprint, request, jsonify
from data.generator import get_regions, get_region_detail

region_bp = Blueprint('region', __name__)


@region_bp.route('/api/regions', methods=['GET'])
def regions_list():
    level = request.args.get('level', default='province', type=str)
    region_filter = request.args.get('region', default=None, type=str)
    return jsonify(get_regions(level, region_filter))


@region_bp.route('/api/regions/<code>', methods=['GET'])
def region_detail(code):
    return jsonify(get_region_detail(code))
