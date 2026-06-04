const buildCategoryTree = (categoryList: any, parentCategory: string) => {
  const tree: any = [];
  categoryList.forEach((item: any) => {
    if(item.parentCategory === parentCategory) {
      const children = buildCategoryTree(categoryList, item.id);
      tree.push({
        id: item.id,
        name: item.name,
        children: children
      });
    }
  });
  return tree;
}

export default buildCategoryTree;