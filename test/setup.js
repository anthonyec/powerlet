require('@babel/register')({
  ignore: ['node_modules/'],
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.d.ts'],
  cache: false
});
