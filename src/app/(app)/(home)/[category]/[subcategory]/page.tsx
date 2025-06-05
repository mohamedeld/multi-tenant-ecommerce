
interface IProps{
    params:Promise<{
        category:string;
        subcategory:string;
    }>
}
const SubCategoryPage = async ({params}:IProps) => {
  const {category,subcategory} = await params;
    return (
    <div>category {category}
    <br/>
    subCategory {subcategory}
    </div>
  )
}

export default SubCategoryPage