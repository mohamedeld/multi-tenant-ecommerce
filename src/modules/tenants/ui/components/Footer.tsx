import Link from "next/link"

const Footer = () => {
  return (
     <div className='border-t font-medium bg-white'>
        <div className="max-w-(--breakpoint-xl) mx-auto flex gap-2 py-6 items-center  h-full px-4 lg:px-12">
            <p>Powered by </p>
            <Link href={"/"}>
                <span className={"text-2xl font-medium"}>funroad</span>
            </Link>
        </div>
    </div>
  )
}

export default Footer