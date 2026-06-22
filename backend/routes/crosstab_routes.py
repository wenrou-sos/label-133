"""
交叉分析 API 路由
"""
from flask import Blueprint, request, jsonify
from data.generator import get_crosstab_data

crosstab_bp = Blueprint('crosstab', __name__)


@crosstab_bp.route('/api/crosstab', methods=['GET'])
def crosstab():
    dim_x = request.args.get('dimX', default='age', type=str)
    dim_y = request.args.get('dimY', default='education', type=str)
    year = request.args.get('year', default=2024, type=int)
    metric = request.args.get('metric', default='divorceRate', type=str)
    return jsonify(get_crosstab_data(dim_x, dim_y, year, metric))
