import * as CKEditorConf from '../../custom-configs/ckeditor.js';

export class CKEditorHelper {
    constructor(private ckeditor: any) {
    }

    public getConfig(): any {
        return CKEditorConf.conf;
    }

    public setReadOnly(readonly: boolean): void {
        CKEditorConf.conf.readOnly = false;
    }

    public getReadOnly(readonly: boolean): any {
        return CKEditorConf.conf.readOnly;
    }

    public setData(data: string): void {
        this.ckeditor.instance.setData(data);
    }

    public getData(): any {
        return this.ckeditor.instance.getData();
    }

    public setValue(value: any): void {
        this.ckeditor.value = value;
    }
}