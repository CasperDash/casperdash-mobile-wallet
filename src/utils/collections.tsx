const getArrayNotInArray = (source: any, sample: any) => {
    return source.filter((i: any) => {
        return sample.indexOf(i) === -1;
    });
};

export {
    getArrayNotInArray,
};
