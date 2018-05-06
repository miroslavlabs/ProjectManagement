export class Objects {

    public static addProrortypesToExistingObjects(): void {
        this.addErrorPrototypes();
    }

    private static addErrorPrototypes(): void {
        // The toJSON method is missing for the Error object. As a result, not all
        // properties get serialized to string. The addition of the prototype solves
        // the issue.
        Object.defineProperty(Error.prototype, 'toJSON', {
            value: function () {
                var alt = {};

                Object.getOwnPropertyNames(this).forEach(function (key) {
                    alt[key] = this[key];
                }, this);

                return alt;
            },
            configurable: true,
            writable: true
        });
    }
}