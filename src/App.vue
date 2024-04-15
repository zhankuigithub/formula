<template>
    <div id="app">
        <FormulaDesigner
            :fieldOptions="fieldOptions"
            @input="getExpression"
            :enumOptionsMap="enumOptionsMap"
            :provinceList="provinceList"
            :cityList="cityList"
            :districtList="districtList"
        />
    </div>
</template>

<script>
import FormulaDesigner from './components/FormulaDesigner.vue'

export default {
    name: 'App',
    components: {
        FormulaDesigner
    },
    data() {
        // 以下数据都是案例，可以配置自己的
        return {
            fieldOptions: [
                { label: '出生日期', value: 'column1', type: 'date' },
                { label: '入院时间', value: 'column2', type: 'datetime' },
                { label: '激活状态', value: 'column3', type: 'enum' },
                { label: '姓名', value: 'column4', type: 'string' },
                { label: '省份', value: 'column5', type: 'province' },
                { label: '城市', value: 'column6', type: 'city' },
                { label: '区县', value: 'column7', type: 'district' },
                { label: '年龄', value: 'column8', type: 'number' }
            ],
            enumOptionsMap: {
                column3: { '0000': '未注销', '0001': '已注销' }
            },
            // 省份
            provinceList: [
                { label: '北京市', value: '北京市' },
                { label: '天津市', value: '天津市' },
                { label: '河北省', value: '河北省' },
                { label: '山西省', value: '山西省' },
                { label: '内蒙古自治区', value: '内蒙古自治区' },
                { label: '辽宁省', value: '辽宁省' },
                { label: '吉林省', value: '吉林省' },
                { label: '黑龙江省', value: '黑龙江省' },
                { label: '上海市', value: '上海市' },
                { label: '江苏省', value: '江苏省' },
                { label: '浙江省', value: '浙江省' },
                { label: '安徽省', value: '安徽省' },
                { label: '福建省', value: '福建省' },
                { label: '江西省', value: '江西省' },
                { label: '山东省', value: '山东省' },
                { label: '河南省', value: '河南省' },
                { label: '湖北省', value: '湖北省' },
                { label: '湖南省', value: '湖南省' },
                { label: '广东省', value: '广东省' },
                { label: '广西壮族自治区', value: '广西壮族自治区' },
                { label: '海南省', value: '海南省' },
                { label: '重庆市', value: '重庆市' },
                { label: '四川省', value: '四川省' },
                { label: '贵州省', value: '贵州省' },
                { label: '云南省', value: '云南省' },
                { label: '西藏自治区', value: '西藏自治区' },
                { label: '陕西省', value: '陕西省' },
                { label: '甘肃省', value: '甘肃省' },
                { label: '青海省', value: '青海省' },
                { label: '宁夏回族自治区', value: '宁夏回族自治区' },
                { label: '新疆维吾尔自治区', value: '新疆维吾尔自治区' },
                { label: '台湾省', value: '台湾省' },
                { label: '香港特别行政区', value: '香港特别行政区' },
                { label: '澳门特别行政区', value: '澳门特别行政区' }
            ],
            // 测试数据
            cityList: [
                { label: '北京城区', value: '北京城区' },
                { label: '天津城区', value: '天津城区' },
                { label: '石家庄市', value: '石家庄市' },
                { label: '唐山市', value: '唐山市' },
                { label: '秦皇岛市', value: '秦皇岛市' },
                { label: '邯郸市', value: '邯郸市' },
                { label: '邢台市', value: '邢台市' },
                { label: '保定市', value: '保定市' },
                { label: '张家口市', value: '张家口市' },
                { label: '承德市', value: '承德市' },
                { label: '沧州市', value: '沧州市' },
                { label: '廊坊市', value: '廊坊市' },
                { label: '衡水市', value: '衡水市' },
                { label: '太原市', value: '太原市' },
                { label: '大同市', value: '大同市' },
                { label: '阳泉市', value: '阳泉市' },
                { label: '长治市', value: '长治市' },
                { label: '晋城市', value: '晋城市' },
                { label: '朔州市', value: '朔州市' },
                { label: '晋中市', value: '晋中市' },
                { label: '运城市', value: '运城市' },
                { label: '忻州市', value: '忻州市' },
                { label: '临汾市', value: '临汾市' },
                { label: '吕梁市', value: '吕梁市' }
            ],
            // 测试数据
            districtList: [
                { label: '东城区', value: '东城区' },
                { label: '西城区', value: '西城区' },
                { label: '朝阳区', value: '朝阳区' },
                { label: '丰台区', value: '丰台区' },
                { label: '石景山区', value: '石景山区' },
                { label: '海淀区', value: '海淀区' },
                { label: '门头沟区', value: '门头沟区' },
                { label: '房山区', value: '房山区' },
                { label: '通州区', value: '通州区' },
                { label: '顺义区', value: '顺义区' },
                { label: '昌平区', value: '昌平区' },
                { label: '大兴区', value: '大兴区' },
                { label: '怀柔区', value: '怀柔区' },
                { label: '平谷区', value: '平谷区' },
                { label: '密云区', value: '密云区' },
                { label: '延庆区', value: '延庆区' },
                { label: '和平区', value: '和平区' },
                { label: '河东区', value: '河东区' },
                { label: '河西区', value: '河西区' },
                { label: '南开区', value: '南开区' },
                { label: '河北区', value: '河北区' },
                { label: '红桥区', value: '红桥区' },
                { label: '东丽区', value: '东丽区' },
                { label: '西青区', value: '西青区' },
                { label: '津南区', value: '津南区' },
                { label: '北辰区', value: '北辰区' },
                { label: '武清区', value: '武清区' },
                { label: '宝坻区', value: '宝坻区' },
                { label: '滨海新区', value: '滨海新区' },
                { label: '宁河区', value: '宁河区' },
                { label: '静海区', value: '静海区' },
                { label: '蓟州区', value: '蓟州区' },
                { label: '长安区', value: '长安区' },
                { label: '桥西区', value: '桥西区' },
                { label: '新华区', value: '新华区' }
            ]
        }
    },
    methods: {
        getExpression(expression, logic) {
            console.log(expression)
            console.log(JSON.stringify(logic))
        }
    }
}
</script>

<style>
#app {
}
</style>
