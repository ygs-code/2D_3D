module.exports = {
    'src/**/*.{js,jsx,ts,tsx}': [
        'prettier  --write',
        'eslint  --fix',
    ],
    'src/**/*.{css,sss,less,scss,saas}': ['stylelint --fix'],
};
