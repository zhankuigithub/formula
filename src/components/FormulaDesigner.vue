<template>
    <div>
        <el-form :model="logic" ref="logicForm" inline size="mini" style="min-width: 450px">
            <div class="relative-box">
                <div class="relative-left" style="">
                    <em class="mid-line"></em>
                    <div class="mid-text" v-if="logic.groups.length > 1">
                        <span @click="toggleConnector(logic)">
                            {{ logic.connector === 'AND' ? '且' : '或' }}
                        </span>
                    </div>
                </div>
                <div style="width: calc(100% - 28px)">
                    <div v-for="(conditionGroup, groupIndex) in logic.groups" :key="groupIndex" class="condition-group">
                        <div class="condition-group-1">
                            <div class="relative-box">
                                <div class="relative-left">
                                    <em class="mid-line"></em>
                                    <div class="mid-text" v-if="shouldShowConnector(conditionGroup, index)">
                                        <span @click="toggleConnector(conditionGroup)">
                                            {{ conditionGroup.connector === 'AND' ? '且' : '或' }}
                                        </span>
                                    </div>
                                </div>
                                <div style="width: calc(100% - 28px)">
                                    <div
                                        v-for="(condition, index) in conditionGroup.conditions"
                                        :key="index"
                                        class="condition-item"
                                        @mouseenter="handleMouseEnter(groupIndex, index)"
                                        @mouseleave="handleMouseLeave"
                                        :class="{
                                            'condition-item-hovered':
                                                hoveredGroupIndex === groupIndex && hoveredConditionIndex === index
                                        }"
                                    >
                                        <el-form-item prop="field">
                                            <el-select
                                                filterable
                                                style="max-width: 175px"
                                                v-model="condition.field"
                                                placeholder="请选择字段"
                                                clearable
                                                @change="clearValue(condition)"
                                            >
                                                <el-option
                                                    v-for="(option, fieldIndex) in fieldOptions"
                                                    :key="fieldIndex"
                                                    :label="option.label"
                                                    :value="option.value"
                                                    :disabled="isOptionDisabled(option.value)"
                                                >
                                                    <template slot="default">
                                                        <span class="option-label">{{ option.label }}</span>
                                                        <span class="option-type"
                                                            >【{{ getTypeText(option.type) }}】</span
                                                        >
                                                    </template>
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item prop="operator">
                                            <el-select
                                                style="max-width: 120px"
                                                v-model="condition.operator"
                                                placeholder="请选择运算符"
                                                clearable
                                            >
                                                <el-option
                                                    v-for="(option, operatorIndex) in getOperatorOptions(
                                                        condition.field
                                                    )"
                                                    :key="operatorIndex"
                                                    :label="option.label"
                                                    :value="option.value"
                                                >
                                                    <template slot="default">
                                                        <span class="option-label">{{ option.label }}</span>
                                                        <span class="option-type">{{ option.logo }}</span>
                                                    </template>
                                                </el-option>
                                            </el-select>
                                        </el-form-item>

                                        <template v-if="showValueInput(condition)">
                                            <template v-if="condition.operator === 'between'">
                                                <el-form-item
                                                    :prop="'groups.' + groupIndex + '.conditions.' + index + '.value'"
                                                    :rules="getValidationRules(condition)"
                                                >
                                                    <el-date-picker
                                                        style="max-width: 175px"
                                                        v-model.trim="condition.value"
                                                        :placeholder="getPlaceholder(condition.field)"
                                                        :type="getDateType(condition.field)"
                                                        :format="getDateFormat(condition.field)"
                                                        :value-format="getValueFormat(condition.field)"
                                                        v-if="isDateField(condition.field)"
                                                    ></el-date-picker>
                                                    <el-input
                                                        v-else
                                                        style="max-width: 175px"
                                                        v-model.trim="condition.value"
                                                        placeholder="最小值"
                                                    ></el-input>
                                                </el-form-item>
                                                <el-form-item>
                                                    <span style="font-size: 12px">至</span>
                                                </el-form-item>
                                                <el-form-item
                                                    :prop="
                                                        'groups.' + groupIndex + '.conditions.' + index + '.valueMax'
                                                    "
                                                    :rules="getValidationRules(condition)"
                                                >
                                                    <el-date-picker
                                                        style="max-width: 175px"
                                                        v-model.trim="condition.valueMax"
                                                        :placeholder="getPlaceholder(condition.field)"
                                                        :type="getDateType(condition.field)"
                                                        :format="getDateFormat(condition.field)"
                                                        :value-format="getValueFormat(condition.field)"
                                                        v-if="isDateField(condition.field)"
                                                    ></el-date-picker>

                                                    <el-input
                                                        v-else
                                                        style="max-width: 175px"
                                                        v-model.trim="condition.valueMax"
                                                        placeholder="最大值"
                                                    ></el-input>
                                                </el-form-item>
                                            </template>

                                            <template v-else>
                                                <el-form-item
                                                    :prop="'groups.' + groupIndex + '.conditions.' + index + '.value'"
                                                    :rules="getValidationRules(condition)"
                                                >
                                                    <el-date-picker
                                                        style="max-width: 175px"
                                                        v-model.trim="condition.value"
                                                        :placeholder="getPlaceholder(condition.field)"
                                                        :type="getDateType(condition.field)"
                                                        :format="getDateFormat(condition.field)"
                                                        :value-format="getValueFormat(condition.field)"
                                                        v-if="isDateField(condition.field)"
                                                    ></el-date-picker>

                                                    <el-select
                                                        style="max-width: 175px"
                                                        v-else-if="isSpecialFieldType(condition.field)"
                                                        v-model.trim="condition.value"
                                                        :placeholder="getPlaceholder(condition.field)"
                                                        multiple
                                                        collapse-tags
                                                        filterable
                                                    >
                                                        <el-option
                                                            v-for="(option, index) in getSpecialFieldOptions(
                                                                condition.field
                                                            )"
                                                            :key="index"
                                                            :label="option.label"
                                                            :value="option.value"
                                                        />
                                                    </el-select>

                                                    <el-input
                                                        style="max-width: 175px"
                                                        v-else
                                                        v-model.trim="condition.value"
                                                        :placeholder="getPlaceholder(condition.field)"
                                                        clearable
                                                    >
                                                        <template
                                                            v-if="
                                                                condition.operator === '=' ||
                                                                condition.operator === '<>'
                                                            "
                                                            v-slot:append
                                                        >
                                                            <i
                                                                class="el-icon-edit"
                                                                @click="editValue(condition, groupIndex, index)"
                                                            ></i>
                                                        </template>
                                                    </el-input>
                                                </el-form-item>
                                            </template>
                                        </template>

                                        <el-form-item
                                            v-show="hoveredGroupIndex === groupIndex && hoveredConditionIndex === index"
                                        >
                                            <el-tooltip content="删除条件" placement="top">
                                                <img
                                                    src="@/assets/images/del.svg"
                                                    @click="removeCondition(groupIndex, index)"
                                                    class="del-img"
                                                />
                                            </el-tooltip>
                                        </el-form-item>
                                    </div>
                                </div>
                            </div>
                            <el-form-item>
                                <span style="margin-left: 20px"></span>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="text" @click="addCondition(groupIndex)" :disabled="disabledAdd"
                                    >添加条件</el-button
                                >
                            </el-form-item>
                        </div>
                    </div>
                </div>
            </div>

            <el-form-item>
                <el-button type="text" @click="addConditionGroup" :disabled="disabledAdd">添加条件组</el-button>
            </el-form-item>
        </el-form>

        <RichTextEditor
            v-if="open"
            :open="open"
            :editorContent="editorContent"
            @save="handleSaveRichTextEditor"
            @close="closeDialog"
        />
    </div>
</template>

<script>
import RichTextEditor from './RichTextEditor.vue' // 引入弹窗组件

export default {
    name: 'FormulaDesigner',
    components: {
        RichTextEditor
    },
    props: {
        fieldOptions: [],
        enumOptionsMap: {},
        provinceList: [],
        cityList: [],
        districtList: []
    },
    data() {
        return {
            open: false,
            editorContent: '',
            editingGroupIndex: -1,
            editingConditionIndex: -1,
            hoveredGroupIndex: -1,
            hoveredConditionIndex: -1,
            logic: {
                groups: [],
                connector: 'AND'
            },
            expression: '',
            operatorOptions: [
                { label: '等于', value: '=', logo: '=' },
                { label: '不等于', value: '<>', logo: '≠' },
                { label: '小于', value: '<', logo: '<' },
                { label: '小于等于', value: '<=', logo: '≤' },
                { label: '大于', value: '>', logo: '>' },
                { label: '大于等于', value: '>=', logo: '≥' },
                { label: '包含', value: 'like', logo: '⊆' },
                { label: '不包含', value: 'not like', logo: '⊊' },
                { label: '有值', value: 'is not null', logo: '√' },
                { label: '无值', value: 'is null', logo: '×' },
                { label: '区间', value: 'between', logo: '[α,β]' }
            ],
            hoveredIndex: -1,
            disabledAdd: false
        }
    },
    computed: {
        getSpecialFieldOptions() {
            return (field) => {
                const fieldType = this.getFieldType(field)
                if (fieldType === 'enum') {
                    // 根据字段的值在 enumOptionsMap 中查找对应的选项
                    const enumValues = this.enumOptionsMap[field]
                    if (enumValues) {
                        return Object.keys(enumValues).map((value) => ({
                            label: enumValues[value],
                            value: value
                        }))
                    } else {
                        return []
                    }
                } else if (fieldType === 'province') {
                    return this.provinceList
                } else if (fieldType === 'city') {
                    return this.cityList
                } else if (fieldType === 'district') {
                    return this.districtList
                } else {
                    // 如果不是特殊字段类型，返回空数组
                    return []
                }
            }
        },
        // 根据字段类型动态生成运算符选项
        getOperatorOptions() {
            return (field) => {
                const fieldType = this.getFieldType(field)
                switch (fieldType) {
                    case 'number':
                        return this.operatorOptions.filter(
                            (option) =>
                                option.value === '=' ||
                                option.value === '<>' ||
                                option.value === '<' ||
                                option.value === '<=' ||
                                option.value === '>' ||
                                option.value === '>=' ||
                                option.value === 'is not null' ||
                                option.value === 'is null' ||
                                option.value === 'between'
                        )
                    case 'string':
                        return this.operatorOptions.filter((option) => option.value === '=' || option.value === '<>')
                    case 'date':
                        return this.operatorOptions.filter(
                            (option) =>
                                option.value === '=' ||
                                option.value === '<=' ||
                                option.value === '>=' ||
                                option.value === 'is not null' ||
                                option.value === 'is null' ||
                                option.value === 'between'
                        )
                    case 'datetime':
                        return this.operatorOptions.filter(
                            (option) =>
                                option.value === '<=' ||
                                option.value === '>=' ||
                                option.value === 'is not null' ||
                                option.value === 'is null' ||
                                option.value === 'between'
                        )
                    default:
                        return this.operatorOptions.filter((option) => option.value === '=')
                }
            }
        }
    },
    watch: {
        logic: {
            immediate: true,
            deep: true,
            handler() {
                this.generateExpression()
                this.$emit('input', this.expression, this.logic)
            }
        }
    },
    methods: {
        handleMouseEnter(groupIndex, index) {
            this.hoveredGroupIndex = groupIndex
            this.hoveredConditionIndex = index
        },
        handleMouseLeave() {
            this.hoveredGroupIndex = -1
            this.hoveredConditionIndex = -1
        },
        // 切换连接符
        toggleConnector(condition) {
            condition.connector = condition.connector === 'AND' ? 'OR' : 'AND'
        },
        addCondition(groupIndex) {
            // 找到尚未被使用的字段
            let unusedFields = this.fieldOptions.filter((option) => {
                for (const conditionGroup of this.logic.groups) {
                    for (const condition of conditionGroup.conditions) {
                        if (condition.field === option.value) {
                            return false // 如果字段已被使用，则将其排除
                        }
                    }
                }
                // 如果字段尚未被使用，则保留
                return true
            })

            if (unusedFields.length === 1) {
                this.disabledAdd = true
            }
            // 如果存在尚未被使用的字段，则选择第一个字段
            const field = unusedFields[0].value

            const operatorOptions = this.getOperatorOptions(field)
            const defaultOperator = operatorOptions.length > 0 ? operatorOptions[0].value : ''

            let value = null
            let valueMax = null

            // 检查字段类型是否为特殊字段类型
            if (this.isSpecialFieldType(field)) {
                const specialOptions = this.getSpecialFieldOptions(field)
                // 如果存在特殊字段选项，则将值设置为第一个选项的值
                if (specialOptions.length > 0) {
                    value = [specialOptions[0].value]
                }
            }

            this.logic.groups[groupIndex].conditions.push({
                field: field,
                operator: defaultOperator,
                value: value,
                valueMax: valueMax
            })
        },
        removeCondition(groupIndex, conditionIndex) {
            const group = this.logic.groups[groupIndex]
            // 删除条件
            group.conditions.splice(conditionIndex, 1)
            // 检查当前组中条件的数量是否为0
            if (group.conditions.length === 0) {
                // 删除当前条件组
                this.logic.groups.splice(groupIndex, 1)
            }
            // 这里可以无脑设置false
            this.disabledAdd = false
        },
        addConditionGroup() {
            let unusedFields = this.fieldOptions.filter((option) => {
                for (const conditionGroup of this.logic.groups) {
                    for (const condition of conditionGroup.conditions) {
                        if (condition.field === option.value) {
                            return false
                        }
                    }
                }
                return true
            })

            if (unusedFields.length === 1) {
                this.disabledAdd = true
            }
            const field = unusedFields[0].value

            const operatorOptions = this.getOperatorOptions(field)
            const defaultOperator = operatorOptions.length > 0 ? operatorOptions[0].value : ''

            let value = null
            let valueMax = null

            // 检查字段类型是否为特殊字段类型
            if (this.isSpecialFieldType(field)) {
                const specialOptions = this.getSpecialFieldOptions(field)
                // 如果存在特殊字段选项，则将值设置为第一个选项的值
                if (specialOptions.length > 0) {
                    value = [specialOptions[0].value]
                }
            }

            this.logic.groups.push({
                conditions: [
                    {
                        field: field,
                        operator: defaultOperator,
                        value: value,
                        valueMax: valueMax // 仅针对区间类型的条件，表示区间的最大值
                    }
                ],
                connector: 'AND'
            })
        },
        removeConditionGroup(groupIndex) {
            this.logic.groups.splice(groupIndex, 1)
        },
        generateExpression() {
            if (this.logic.groups.length === 0) {
                this.expression = ''
                return
            }
            const firstConditionGroupConnector = this.logic.connector
            this.expression = this.logic.groups
                .map((conditionGroup, index) => {
                    const firstConditionConnector = conditionGroup.connector
                    const conditionsExpression = conditionGroup.conditions
                        .map((condition, index) => {
                            if (condition.operator === 'is null' || condition.operator === 'is not null') {
                                return `${condition.field} ${condition.operator}`
                            } else {
                                let value = condition.value
                                let valueMax = condition.valueMax

                                if (condition.operator === 'between') {
                                    if (this.isDateField(condition.field)) {
                                        value = `'${value}' and '${valueMax}'`
                                    } else {
                                        value = `${value} and ${valueMax}`
                                    }
                                } else {
                                    // 处理带有英文逗号的情况
                                    if (
                                        (condition.operator === '=' || condition.operator === '<>') &&
                                        value.includes(',')
                                    ) {
                                        const values = value.split(',').map((val) => val.trim())
                                        // 检查字段类型，决定使用 IN 还是普通等于操作符
                                        const fieldIsString = this.getFieldType(condition.field) === 'string'
                                        const operator = condition.operator === '=' ? 'in' : 'not in'
                                        if (fieldIsString) {
                                            // 字符串类型字段，需要给每个值加上引号
                                            value = `(${values.map((val) => `'${val}'`).join(',')})`
                                        } else {
                                            // 数字类型字段，直接使用拼接字符串
                                            value = `(${values.join(',')})`
                                        }
                                        return `${condition.field} ${operator} ${value}`
                                    } else {
                                        let fieldType = this.getFieldType(condition.field)
                                        if (condition.operator === 'like' || condition.operator === 'not like') {
                                            value = `'%${value}%'`
                                        } else if (
                                            fieldType === 'string' ||
                                            fieldType === 'date' ||
                                            fieldType === 'datetime'
                                        ) {
                                            value = `'${value}'`
                                        }
                                    }
                                }
                                return `${condition.field} ${condition.operator} ${value}`
                            }
                        })
                        .join(` ${firstConditionConnector} `)
                    return `(${conditionsExpression}) ${
                        index !== this.logic.groups.length - 1 ? firstConditionGroupConnector : ''
                    }`
                })
                .join('')
        },
        getFieldType(field) {
            const fieldOption = this.fieldOptions.find((option) => option.value === field)
            return fieldOption ? fieldOption.type : 'unknown'
        },
        getPlaceholder(field) {
            const fieldType = this.getFieldType(field)
            if (fieldType === 'string') {
                return '请输入值'
            } else if (fieldType === 'number') {
                return '请输入数字'
            } else if (fieldType === 'date') {
                return '请选择日期'
            } else if (fieldType === 'datetime') {
                return '请选择时间'
            } else if (fieldType === 'province') {
                return '请选择省份'
            } else if (fieldType === 'city') {
                return '请选择城市'
            } else if (fieldType === 'district') {
                return '请选择区县'
            } else if (fieldType === 'enum') {
                return '请选择枚举值'
            } else {
                return '未知类型'
            }
        },
        isDateField(field) {
            const fieldType = this.getFieldType(field)
            return fieldType === 'date' || fieldType === 'datetime'
        },
        getDateType(field) {
            const fieldType = this.getFieldType(field)
            return fieldType === 'date' ? 'date' : 'datetime'
        },
        getDateFormat(field) {
            const fieldType = this.getFieldType(field)
            return fieldType === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'
        },
        getValueFormat(field) {
            const fieldType = this.getFieldType(field)
            return fieldType === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'
        },
        showValueInput(condition) {
            return condition.operator !== 'is null' && condition.operator !== 'is not null'
        },
        shouldShowConnector(conditionGroup, index) {
            return index !== conditionGroup.conditions.length - 1 && conditionGroup.conditions.length > 1
        },
        clearValue(condition) {
            // 根据字段类型获取可选择的运算符选项
            const operatorOptions = this.getOperatorOptions(condition.field)
            // 如果存在运算符选项，则将运算符赋值为第一个选项的值
            if (operatorOptions && operatorOptions.length > 0) {
                condition.operator = operatorOptions[0].value
            }
            condition.value = ''
            condition.valueMax = ''
        },
        editValue(condition, groupIndex, index) {
            this.editingGroupIndex = groupIndex
            this.editingConditionIndex = index
            this.open = true
            this.editorContent = condition.value
        },
        handleSaveRichTextEditor(content) {
            if (this.editingConditionIndex !== -1) {
                this.logic.groups[this.editingGroupIndex].conditions[this.editingConditionIndex].value = content
            }
            this.open = false
        },
        closeDialog() {
            this.open = false
        },
        getTypeText(type) {
            const typeMap = {
                string: '文本',
                number: '数值',
                date: '日期',
                datetime: '时间',
                province: '省份',
                city: '城市',
                district: '区县',
                enum: '枚举'
            }
            return typeMap[type] || '未知类型'
        },
        isSpecialFieldType(field) {
            const fieldType = this.getFieldType(field)
            return fieldType === 'province' || fieldType === 'city' || fieldType === 'district' || fieldType === 'enum'
        },
        isOptionDisabled(value) {
            // 遍历所有条件，检查是否有条件的 field 字段已经选择了当前的 value
            for (const conditionGroup of this.logic.groups) {
                for (const condition of conditionGroup.conditions) {
                    if (condition.field === value) {
                        return true // 如果找到已选择的值，则将选项设置为不可用
                    }
                }
            }
            return false // 如果没有找到已选择的值，则将选项设置为可用
        },
        getValidationRules(condition) {
            let rules = [{ required: true, message: ' ', trigger: 'blur' }]
            if (this.isSpecialFieldType(condition.field)) {
                rules = [{ required: true, message: ' ', trigger: 'change' }]
            }
            return rules
        },
        checkParams() {
            return this.$refs['logicForm'].validate()
        }
    }
}
</script>

<style scoped>
.condition-group {
    margin-bottom: 5px;
}
.condition-group-1 {
    padding: 5px;
}
.condition-group-2 {
    margin-top: 6px;
}
.condition-item {
}
.expression {
    margin-top: 20px;
}
.el-form-item {
    margin-bottom: 1px;
}
.form-reverse {
    display: flex;
    flex-direction: row-reverse; /* 从右向左排列 */
}
.del-img {
    width: 15px;
    cursor: pointer;
    margin-top: 5px;
}
.el-icon-edit {
    cursor: pointer;
}
.option-type {
    float: right;
    font-size: 11px;
}
.relative-box {
    position: relative;
    display: flex;
    width: 100%;
}
.relative-left {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 24px;
    margin-right: 4px;
}
.relative-left {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 24px;
    margin-right: 4px;
    &:hover {
        cursor: pointer;
        .mid-line {
            background-color: #3d90ff;
        }
        .mid-text {
            border: 1px solid #3d90ff;
            background-color: #3d90ff;

            span {
                color: white;
            }
        }
    }
}
.mid-line {
    top: 2px;
    height: calc(100% - 3px);
    position: absolute;
    left: 12px;
    width: 1px;
    background-color: #d9dfe6;
    transition: all 0.3s;
}
.mid-text {
    position: absolute;
    top: 50%;
    left: 0;
    width: 24px;
    height: 24px;
    margin-top: -12px;
    color: #3d90ff;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
    background-color: #fff;
    border: 1px solid #d9dfe6;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.3s;
}
</style>
