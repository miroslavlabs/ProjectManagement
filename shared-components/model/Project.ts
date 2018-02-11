class Project {
    constructor(
        public readonly title : string,
        public readonly shortDescription : string,
        public readonly fullDescription : string,
        public readonly id? : number) {

        }
}

export { Project };