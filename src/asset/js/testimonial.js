const testimonials = [
    {
        image:
            "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        content: "Pelayanan luar biasa! Sangat puas dengan hasil yang diberikan.",
        author: "Andi",
        star: 5,
    },
    {
        image:
            "https://images.pexels.com/photos/2169434/pexels-photo-2169434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        content: "Kerja sangat profesional dan cepat. Pasti akan kembali lagi!",
        author: "Nina",
        star: 4,
    },
    {
        image:
            "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600",
        content: "Hasil tidak sesuai ekspektasi saya, banyak yang kurang.",
        author: "Bayu",
        star: 2,
    },
    {
        image:
            "https://images.pexels.com/photos/839633/pexels-photo-839633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        content: "Pengalaman kerja yang luar biasa! Sangat direkomendasikan.",
        author: "Siti",
        star: 5,
    },
    {
        image:
            "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        content: "Sangat memuaskan, akan merekomendasikan ke teman-teman saya.",
        author: "Rizki",
        star: 4,
    },
    {
        image:
            "https://images.pexels.com/photos/2117283/pexels-photo-2117283.jpeg?auto=compress&cs=tinysrgb&w=600",
        content: "Harga oke, tapi hasil kurang memuaskan. Ada yang perlu ditingkatkan.",
        author: "Fajar",
        star: 3,
    },
    {
        image:
            "https://images.pexels.com/photos/3760914/pexels-photo-3760914.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        content: "Pekerjaan tidak selesai tepat waktu, kurang profesional.",
        author: "Tina",
        star: 2,
    },
    {
        image:
            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
        content: "Layanan cepat, hasil sempurna. Sangat memuaskan!",
        author: "Rina",
        star: 5,
    },
    {
        image:
            "https://images.pexels.com/photos/12311415/pexels-photo-12311415.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        content: "Kualitas terbaik, sangat senang dengan hasil akhirnya.",
        author: "Agus",
        star: 5,
    },
    {
        image:
            "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
        content: "Kerja bagus, tapi masih ada beberapa hal yang perlu diperbaiki.",
        author: "Dian",
        star: 3,
    },
];


async function getAllTestimonials() {
    try {
        let testimonials = await fetch("https://api.npoint.io/2bcee80ab0de785ddaa5")
        testimonials = await testimonials.json();

        const testimonialHTML = testimonials.map((testimonial) => {
            return `<div class="testimonial">
                  <img src="${testimonial.image}" class="profile-testimonial" />
                  <p class="quote">"${testimonial.content}"</p>
                  <p class="author">- ${testimonial.author}</p>
                  <p class="author"><i class="fas fa-star"></i>${testimonial.star}</p>
              </div>`
        })

        document.getElementById("testimonials").innerHTML = testimonialHTML.join("")
    } catch (error) {
        console.error(error)
    }
}

async function getTestimonialByStar(star) {
    try {
        let testimonials = await fetch("https://api.npoint.io/2bcee80ab0de785ddaa5")
        testimonials = await testimonials.json();


        const filteredTestimonials = testimonials.filter((testimonial) => {
            return testimonial.star === star
        })

        const testimonialHTML = filteredTestimonials.map((testimonial) => {
            return `<div class="testimonial">
                <img src="${testimonial.image}" class="profile-testimonial" />
                <p class="quote">"${testimonial.content}"</p>
                <p class="author">- ${testimonial.author}</p>
                <p class="author"><i class="fas fa-star"></i>${testimonial.star}</p>
            </div>`
        })

        document.getElementById("testimonials").innerHTML = testimonialHTML.join("")
    } catch (error) {
        console.error(error)
    }
}

getAllTestimonials()