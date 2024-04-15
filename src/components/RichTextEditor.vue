<template>
    <el-dialog
        title="批量添加"
        append-to-body
        width="40%"
        :visible.sync="open"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        v-if="open"
        :before-close="cancel"
    >
        <el-form ref="form" :model="formData" size="mini">
            <el-form-item label="" prop="content">
                <span style="font-size: 12px; color: red">*使用回车换行分隔</span>
                <el-input v-model="formattedEditorContent" type="textarea" rows="15"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" @click="saveContent">保存</el-button>
                <el-button size="mini" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
    name: "RichTextEditor",
    props: {
        open: {
            type: Boolean,
            default: false
        },
        editorContent: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            formData: {
                content: ''
            },
            formattedEditorContent: ''
        }
    },
    watch: {
        editorContent(newValue) {
            this.formatContent(newValue)
        }
    },
    mounted() {
        this.formatContent(this.editorContent)
    },
    methods: {
        saveContent() {
            // Validate form before saving
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // 将换行符转换为英文逗号并返回给父组件
                    const contentWithCommas = this.formattedEditorContent.replace(/\n/g, ',');
                    this.$emit('save', contentWithCommas);
                    this.cancel()
                }
            })
        },
        cancel() {
            this.$emit('close')
        },
        formatContent(content) {
            // 如果editorContent中存在英文逗号，则将其转换为换行符
            this.formattedEditorContent = content.includes(',') ? content.replace(/,/g, '\n') : content
        }
    }
}
</script>
