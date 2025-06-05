
interface IProps{
    params:Promise<{
        category:string;
    }>
}
const CategoryPage = async ({params}:IProps) => {
  const {category} = await params;
    return (
    <div>category {category}</div>
  )
}

export default CategoryPage