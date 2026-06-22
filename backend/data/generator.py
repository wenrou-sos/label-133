"""
婚姻数据生成模块 - 基于真实统计趋势生成模拟数据
"""
import random
import math
from datetime import date, timedelta
import numpy as np

random.seed(42)
np.random.seed(42)

# 近10年的基础数据（基于真实趋势模拟）
BASELINE_DATA = {
    2015: {"marriage_count": 1224.7, "divorce_count": 384.1, "marriage_rate": 9.0, "divorce_rate": 2.8},
    2016: {"marriage_count": 1142.8, "divorce_count": 415.8, "marriage_rate": 8.3, "divorce_rate": 3.0},
    2017: {"marriage_count": 1063.1, "divorce_count": 437.4, "marriage_rate": 7.7, "divorce_rate": 3.2},
    2018: {"marriage_count": 1013.9, "divorce_count": 446.1, "marriage_rate": 7.3, "divorce_rate": 3.2},
    2019: {"marriage_count": 927.3, "divorce_count": 470.1, "marriage_rate": 6.6, "divorce_rate": 3.4},
    2020: {"marriage_count": 813.1, "divorce_count": 373.3, "marriage_rate": 5.8, "divorce_rate": 2.7},
    2021: {"marriage_count": 763.6, "divorce_count": 213.9, "marriage_rate": 5.4, "divorce_rate": 1.5},
    2022: {"marriage_count": 683.3, "divorce_count": 287.9, "marriage_rate": 4.8, "divorce_rate": 2.0},
    2023: {"marriage_count": 680.5, "divorce_count": 310.4, "marriage_rate": 4.8, "divorce_rate": 2.2},
    2024: {"marriage_count": 695.0, "divorce_count": 325.0, "marriage_rate": 4.9, "divorce_rate": 2.3},
}

POLICY_NODES = [
    {"year": 2021, "month": 1, "name": "离婚冷静期实施", "description": "《民法典》正式实施，离婚冷静期制度生效"},
    {"year": 2016, "month": 1, "name": "全面二孩政策", "description": "全面二孩政策正式实施"},
]

PROVINCES = [
    {"code": "110000", "name": "北京", "region": "east", "population": 2189},
    {"code": "120000", "name": "天津", "region": "east", "population": 1363},
    {"code": "130000", "name": "河北", "region": "east", "population": 7448},
    {"code": "140000", "name": "山西", "region": "central", "population": 3480},
    {"code": "150000", "name": "内蒙古", "region": "west", "population": 2405},
    {"code": "210000", "name": "辽宁", "region": "northeast", "population": 4259},
    {"code": "220000", "name": "吉林", "region": "northeast", "population": 2375},
    {"code": "230000", "name": "黑龙江", "region": "northeast", "population": 3125},
    {"code": "310000", "name": "上海", "region": "east", "population": 2489},
    {"code": "320000", "name": "江苏", "region": "east", "population": 8515},
    {"code": "330000", "name": "浙江", "region": "east", "population": 6577},
    {"code": "340000", "name": "安徽", "region": "central", "population": 6102},
    {"code": "350000", "name": "福建", "region": "east", "population": 4187},
    {"code": "360000", "name": "江西", "region": "central", "population": 4517},
    {"code": "370000", "name": "山东", "region": "east", "population": 10153},
    {"code": "410000", "name": "河南", "region": "central", "population": 9872},
    {"code": "420000", "name": "湖北", "region": "central", "population": 5775},
    {"code": "430000", "name": "湖南", "region": "central", "population": 6604},
    {"code": "440000", "name": "广东", "region": "east", "population": 12684},
    {"code": "450000", "name": "广西", "region": "west", "population": 5027},
    {"code": "460000", "name": "海南", "region": "east", "population": 1020},
    {"code": "500000", "name": "重庆", "region": "west", "population": 3212},
    {"code": "510000", "name": "四川", "region": "west", "population": 8367},
    {"code": "520000", "name": "贵州", "region": "west", "population": 3852},
    {"code": "530000", "name": "云南", "region": "west", "population": 4690},
    {"code": "540000", "name": "西藏", "region": "west", "population": 365},
    {"code": "610000", "name": "陕西", "region": "west", "population": 3956},
    {"code": "620000", "name": "甘肃", "region": "west", "population": 2492},
    {"code": "630000", "name": "青海", "region": "west", "population": 594},
    {"code": "640000", "name": "宁夏", "region": "west", "population": 728},
    {"code": "650000", "name": "新疆", "region": "west", "population": 2589},
]

EDUCATION_LEVELS = ["小学及以下", "初中", "高中/中专", "大专", "本科", "硕士", "博士"]

AGE_GROUPS = ["20岁以下", "20-24岁", "25-29岁", "30-34岁", "35-39岁", "40岁以上"]


def get_core_metrics(year: int = 2024) -> dict:
    """获取核心指标数据"""
    current = BASELINE_DATA.get(year, BASELINE_DATA[2024])
    prev_year = year - 1
    prev = BASELINE_DATA.get(prev_year, BASELINE_DATA[2023])
    
    return {
        "year": year,
        "marriageCount": round(current["marriage_count"], 1),
        "divorceCount": round(current["divorce_count"], 1),
        "marriageRate": round(current["marriage_rate"], 2),
        "divorceRate": round(current["divorce_rate"], 2),
        "marriageYoY": round((current["marriage_count"] - prev["marriage_count"]) / prev["marriage_count"] * 100, 1),
        "divorceYoY": round((current["divorce_count"] - prev["divorce_count"]) / prev["divorce_count"] * 100, 1),
        "marriageRateYoY": round((current["marriage_rate"] - prev["marriage_rate"]) / prev["marriage_rate"] * 100, 1),
        "divorceRateYoY": round((current["divorce_rate"] - prev["divorce_rate"]) / prev["divorce_rate"] * 100, 1),
    }


def get_annual_trend(start_year: int = 2015, end_year: int = 2024) -> list:
    """获取年度趋势数据"""
    trend = []
    for year in range(start_year, end_year + 1):
        if year in BASELINE_DATA:
            data = BASELINE_DATA[year]
            trend.append({
                "year": year,
                "marriageRate": data["marriage_rate"],
                "divorceRate": data["divorce_rate"],
                "marriageCount": data["marriage_count"],
                "divorceCount": data["divorce_count"],
            })
    return trend


def get_policy_nodes() -> list:
    """获取政策节点列表"""
    return POLICY_NODES


def get_heatmap_data(year: int, data_type: str = "marriage") -> dict:
    """获取热力图数据"""
    base_year = BASELINE_DATA.get(year, BASELINE_DATA[2024])
    total = base_year["marriage_count"] if data_type == "marriage" else base_year["divorce_count"]
    
    daily_data = []
    start_date = date(year, 1, 1)
    end_date = date(year, 12, 31)
    
    # 月度季节性因子
    monthly_factors = [0.9, 0.8, 1.0, 1.0, 1.2, 0.9, 0.85, 0.9, 1.15, 1.2, 0.95, 1.05]
    
    # 特殊日期
    special_days = {
        "marriage": [
            (2, 14, "情人节"),
            (5, 20, "520网络情人节"),
            (5, 21, "521我爱你"),
            (9, 9, "天长地久"),
            (10, 1, "国庆节"),
            (10, 2, "国庆假期"),
            (10, 3, "国庆假期"),
            (10, 4, "国庆假期"),
            (10, 5, "国庆假期"),
            (10, 6, "国庆假期"),
            (10, 7, "国庆假期"),
        ],
        "divorce": [
            (1, 20, "春节前高峰"),
            (1, 25, "春节前高峰"),
            (1, 30, "春节前高峰"),
            (2, 15, "春节后高峰"),
            (2, 20, "春节后高峰"),
            (2, 25, "春节后高峰"),
            (7, 15, "高考后高峰"),
            (7, 20, "高考后高峰"),
        ]
    }
    
    current_date = start_date
    total_days = (end_date - start_date).days + 1
    base_daily = total * 10000 / 365  # 转为对数
    
    max_count = 0
    min_count = float('inf')
    
    special_list = special_days.get(data_type, [])
    
    while current_date <= end_date:
        month = current_date.month
        day = current_date.day
        weekday = current_date.weekday()
        
        # 基础值
        count = base_daily * monthly_factors[month - 1]
        
        # 周末因素（结婚周末多，离婚周末少）
        if weekday >= 5:
            if data_type == "marriage":
                count *= 1.3
            else:
                count *= 0.7
        
        # 特殊日期峰值
        is_peak = False
        peak_type = None
        for sm, sd, stype in special_list:
            if month == sm and day == sd:
                count *= 2.5
                is_peak = True
                peak_type = stype
                break
        
        # 随机性
        count *= random.uniform(0.85, 1.15)
        
        count = round(count, 0)
        max_count = max(max_count, count)
        min_count = min(min_count, count)
        
        daily_data.append({
            "month": month,
            "day": day,
            "count": count,
            "isPeak": is_peak,
            "peakType": peak_type,
        })
        
        current_date += timedelta(days=1)
    
    return {
        "year": year,
        "type": data_type,
        "data": daily_data,
        "maxCount": max_count,
        "minCount": min_count,
    }


def get_age_distribution(year: int = 2024) -> list:
    """获取年龄分布数据"""
    # 基础分布 - 25-29岁为主峰
    base_male = [3, 18, 38, 24, 12, 5]
    base_female = [5, 25, 35, 20, 10, 5]
    
    # 年份偏移 - 越晚近，30-34岁占比越高
    year_factor = (year - 2015) / 10
    male_shift = year_factor * 5
    female_shift = year_factor * 4
    
    male_percentages = []
    female_percentages = []
    
    for i, (male_pct, female_pct) in enumerate(zip(base_male, base_female)):
        if i < 2:
            male_pct -= male_shift
            female_pct -= female_shift
        elif i >= 2:
            male_pct += male_shift / 4
            female_pct += female_shift / 4
        male_percentages.append(max(1, male_pct))
        female_percentages.append(max(1, female_pct))
    
    # 归一化
    male_total = sum(male_percentages)
    female_total = sum(female_percentages)
    male_percentages = [round(p / male_total * 100, 1) for p in male_percentages]
    female_percentages = [round(p / female_total * 100, 1) for p in female_percentages]
    
    year_data = BASELINE_DATA.get(year, BASELINE_DATA[2024])
    total_marriages = year_data["marriage_count"] * 10000
    
    result = []
    for gender in ["male", "female"]:
        percentages = male_percentages if gender == "male" else female_percentages
        age_groups = []
        sum_percent = 0
        
        for i, age_range in enumerate(AGE_GROUPS):
            count = round(total_marriages * percentages[i] / 100 / 2)
            age_groups.append({
                "ageRange": age_range,
                "count": count,
                "percentage": percentages[i],
            })
            sum_percent += percentages[i]
        
        # 计算平均年龄
        avg_age = 0
        age_midpoints = [18, 22, 27, 32, 37, 45]
        for i, pct in enumerate(percentages):
            avg_age += age_midpoints[i] * pct / 100
        
        result.append({
            "year": year,
            "gender": gender,
            "ageGroups": age_groups,
            "averageAge": round(avg_age, 1),
            "medianAge": round(avg_age + random.uniform(-1, 1), 1),
        })
    
    return result


def get_regions(level: str = "province", region_filter: str = None) -> list:
    """获取地域数据"""
    national_marriage_rate = BASELINE_DATA[2024]["marriage_rate"]
    national_divorce_rate = BASELINE_DATA[2024]["divorce_rate"]
    
    # 区域调整因子
    region_factors = {
        "east": {"marriage": 0.95, "divorce": 1.2},
        "central": {"marriage": 1.05, "divorce": 0.95},
        "west": {"marriage": 1.1, "divorce": 0.85},
        "northeast": {"marriage": 0.85, "divorce": 1.3},
    }
    
    result = []
    
    for prov in PROVINCES:
        if region_filter and prov["region"] != region_filter:
            continue
            
        factor = region_factors[prov["region"]]
        
        # 添加一些随机性
        random_factor_m = random.uniform(0.9, 1.1)
        random_factor_d = random.uniform(0.85, 1.15)
        
        marriage_rate = round(national_marriage_rate * factor["marriage"] * random_factor_m, 2)
        divorce_rate = round(national_divorce_rate * factor["divorce"] * random_factor_d, 2)
        marriage_count = round(prov["population"] * marriage_rate / 1000, 1)
        divorce_count = round(prov["population"] * divorce_rate / 1000, 1)
        
        result.append({
            "code": prov["code"],
            "name": prov["name"],
            "level": "province",
            "marriageRate": marriage_rate,
            "divorceRate": divorce_rate,
            "marriageCount": marriage_count,
            "divorceCount": divorce_count,
            "population": prov["population"],
            "region": prov["region"],
        })
    
    return result


def get_region_detail(code: str) -> dict:
    """获取地区详情"""
    provinces = {p["code"]: p for p in PROVINCES}
    
    if code not in provinces:
        return {}
    
    prov = provinces[code]
    regions_data = get_regions(region_filter=prov["region"])
    
    return next((r for r in regions_data if r["code"] == code), {})


def get_education_data(year: int = 2024) -> list:
    """获取教育程度数据"""
    # 教育程度离婚率（越高学历离婚率相对越低，但有波动）
    base_divorce_rates = {
        "小学及以下": 2.8,
        "初中": 2.6,
        "高中/中专": 2.3,
        "大专": 2.1,
        "本科": 1.9,
        "硕士": 1.8,
        "博士": 1.7,
    }
    
    # 人口比例
    population_pct = {
        "小学及以下": 25,
        "初中": 35,
        "高中/中专": 20,
        "大专": 10,
        "本科": 8,
        "硕士": 1.5,
        "博士": 0.5,
    }
    
    year_factor = 1 + (year - 2015) * 0.02
    
    total_marriages = BASELINE_DATA[year]["marriage_count"] if year in BASELINE_DATA else BASELINE_DATA[2024]["marriage_count"]
    
    result = []
    for edu_level in EDUCATION_LEVELS:
        divorce_rate = round(base_divorce_rates[edu_level] * year_factor * random.uniform(0.95, 1.05), 2)
        sample_size = round(total_marriages * population_pct[edu_level] / 100 * 10000)
        divorce_count = round(sample_size * divorce_rate / 1000)
        
        result.append({
            "year": year,
            "educationLevel": edu_level,
            "marriageCount": round(sample_size / 10000, 1),
            "divorceCount": round(divorce_count, 1),
            "divorceRate": divorce_rate,
            "sampleSize": sample_size,
            "significance": round(random.uniform(0.01, 0.05), 3),
            "lowerCI": round(divorce_rate * 0.9, 2),
            "upperCI": round(divorce_rate * 1.1, 2),
        })
    
    return result


def get_education_correlation() -> dict:
    """获取教育程度相关性分析"""
    # 教育程度与离婚率负相关
    return {
        "correlation": -0.78,
        "pValue": 0.001,
        "rSquared": 0.61,
        "interpretation": "教育程度与离婚率呈显著负相关，即学历越高，离婚率相对越低。"
    }
