function addToCart(Pro_Id){
    $.ajax({
        url:'/add_to_cart/'+Pro_Id,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count=$('#CartCount').html()
                count=parseInt(count)+1
                $('#CartCount').html(count)
            }
            alert(response)
        }
    })
}

