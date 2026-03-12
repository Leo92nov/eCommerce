export default function Cart({items}){

    return <>
    <div className="w-20 h-20 fixed bottom-6 right-6 rounded-full bg-blue-200">
        <section className="h-8 w-8 bg-red-500 rounded-full bottom right-11 fixed text-center text-white"> 
            {items}
        </section>
        <img src="../../Car6.jpg" alt="" />
    </div>
</>
}