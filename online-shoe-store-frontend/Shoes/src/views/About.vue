<template>

<div class="about" id="About">
        
        <h1>Web<span>About</span></h1>

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
                    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical 
                    Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at 
                    Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a 
                    Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the 
                    undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" 
                    (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, 
                    very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes 
                    from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below 
                    for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also 
                    reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
                </p>
            </div>

        </div>

        <a href="#" class="about_btn">Shop Now</a>

        
        
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