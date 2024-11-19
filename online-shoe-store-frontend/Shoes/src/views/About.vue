<template>

<div class="about" id="About">
        
        <h1>Web<span>Giới thiệu</span></h1>

        <div class="about_main">
            <div class="about_image">
                <div class="about_small_image">
                    <img src="../assets/img/shoes1.png" onclick="functio(this)">
                    <img src="../assets/img/shoes2.png" onclick="functio(this)">
                    <img src="../assets/img/shoes3.png" onclick="functio(this)">
                    <img src="../assets/img/shoes4.png" onclick="functio(this)">
                </div>

                <div class="image_contaner">
                    <img src="../assets/img/shoes1.png" id="imagebox">
                </div>

            </div>

            <div class="about_text">
                <p>
                    Dòng sản phẩm giày của chúng tôi được thiết kế để đáp ứng mọi nhu cầu thời trang và tiện ích của khách hàng. Từ những đôi giày thể thao năng động, phù hợp cho các hoạt động ngoài trời, đến những mẫu giày công sở thanh lịch, tôn lên phong cách chuyên nghiệp, chúng tôi mang đến sự đa dạng và chất lượng vượt trội. Mỗi sản phẩm đều được chế tác từ chất liệu cao cấp, đảm bảo sự bền bỉ và thoải mái khi sử dụng.

                    Ngoài ra, với các thiết kế hiện đại và hợp xu hướng, giày của chúng tôi không chỉ là phụ kiện, mà còn là tuyên ngôn thời trang giúp bạn tự tin thể hiện phong cách riêng. Dòng sản phẩm có sẵn nhiều size và màu sắc, phù hợp cho mọi độ tuổi và giới tính. Hãy để những đôi giày này đồng hành cùng bạn trên mọi chặng đường, từ công việc, dạo phố đến những sự kiện quan trọng trong cuộc sống.
                </p>
            </div>

        </div>

        <a href="#" class="about_btn"> Mua ngay</a>

        
        
    </div>



</template>
<script>
        function functio(small){
            var full = document.getElementById("imagebox")
                full.src = small.src
        }
</script>
<style>

.about{
    margin: 30px;
    width: 100%;
    height: 100vh;
    padding: 50px 0px;
}

.about h1{
    font-size: 60px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: black;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: uppercase;
}

.about h1 span{
    background: linear-gradient(to right, #c72092 , #6c14d0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 15px;
}

.about .about_main{
    position: relative;
    top: 40%;
    left: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.about .about_main .about_image{
    display: flex;
    margin-top: 50px;
}

.about .about_main .about_image .about_small_image{
    display: flex;
    flex-direction: column;
    position: relative;
    top: 15px;
}

.about .about_main .about_image .about_small_image img{
    height: 92px;
    margin: 5px 0;
    cursor: pointer;
    background: linear-gradient(to right, #6c14d0 , #c72092);
    display: block;
    border-radius: 6px;
    padding: 5px 5px;
    box-shadow: 0 0 6px rgba(0,0,0,0.6);
    opacity: 0.8;
    transition: 0.3s;
}

.about .about_main .about_image .about_small_image img:hover{
    opacity: 1;
}

.about .about_main .image_contaner{
    padding: 10px;
    display: flex;
}

.about .about_main .image_contaner img{
    border: 3px solid #6c14d0;
    border-radius: 20px;
    height: 430px;
    padding: 30px;
    box-shadow: 0 0 8px #6c14d0;
}

.about .about_main .about_text{
    margin-top: 45px;
}

.about .about_main .about_text p{
    background: linear-gradient(to left, #c72092 , #6c14d0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 22px;
    width: 600px;
    text-align: justify;
    padding: 25px 30px;
    border: 2px solid #c72092;
    border-radius: 20px;
    box-shadow: 0 0 8px #c72092;
}

.about .about_btn{
    color: black;
    background: none;
    position: relative;
    top: 10%;
    left: 45.5%;
    transform: translate(-50% , -50%);
    padding: 10px 25px;
    border: 2px solid #c72092;
    text-decoration: none;
    box-shadow: 0 0 8px #c72092;
    transition: 0.5s;
    
}

.about .about_btn:hover{
    border: 2px solid transparent;
    background: #c72092;
    color: white;
}
</style>