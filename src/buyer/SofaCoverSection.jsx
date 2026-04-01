import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SofaCoverSection() {
  const navigate = useNavigate();

  const fallbackImage =
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80";

  const sofaData = [
    {
      product_id: "SF101",
      model_name: "Roma Sofa",
      fabric_color: "Warm Beige",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785865/101_waegkr.jpg",
    },
    {
      product_id: "SF102",
      model_name: "Roma Sofa",
      fabric_color: "Beige",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785868/102_ttibfr.png",
    },
    {
      product_id: "SF103",
      model_name: "Roma Sofa",
      fabric_color: "Light Beige",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785869/103_qt4sjj.png",
    },
    {
      product_id: "SF104",
      model_name: "Roma Sofa",
      fabric_color: "Camel Beige",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785869/104_nrp5do.png",
    },
    {
      product_id: "SF105",
      model_name: "Roma Sofa",
      fabric_color: "Brown",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785869/105_yotue1.png",
    },
    {
      product_id: "SF106",
      model_name: "Roma Sofa",
      fabric_color: "Dark Brown",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785872/106_vn1fno.png",
    },
    {
      product_id: "SF107",
      model_name: "Roma Sofa",
      fabric_color: "Terracotta",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785870/107_hh1uzh.png",
    },
    {
      product_id: "SF108",
      model_name: "Roma Sofa",
      fabric_color: "Muted Clay",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785871/108_yqluyu.png",
    },
    {
      product_id: "SF109",
      model_name: "Roma Sofa",
      fabric_color: "Rust",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785873/109_yxsz5q.png",
    },
    {
      product_id: "SF110",
      model_name: "Roma Sofa",
      fabric_color: "Rust Brown",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785874/110_aeo08z.png",
    },
    {
      product_id: "SF111",
      model_name: "Roma Sofa",
      fabric_color: "Sea Green",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785874/111_qalmtq.png",
    },
    {
      product_id: "SF112",
      model_name: "Roma Sofa",
      fabric_color: "Deep Teal",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785876/112_lqamjz.png",
    },
    {
      product_id: "SF113",
      model_name: "Roma Sofa",
      fabric_color: "Teal Blue",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785874/113_ksxrn3.png",
    },
    {
      product_id: "SF114",
      model_name: "Roma Sofa",
      fabric_color: "Light Blue Grey",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785876/114_yzke5r.png",
    },
    {
      product_id: "SF115",
      model_name: "Roma Sofa",
      fabric_color: "Light Grey Beige",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785879/115_bvq6ar.png",
    },
    {
      product_id: "SF116",
      model_name: "Roma Sofa",
      fabric_color: "Grey",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785880/116_lrbasb.png",
    },
    {
      product_id: "SF117",
      model_name: "Roma Sofa",
      fabric_color: "Dark Grey",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785882/117_qf1cva.png",
    },
    {
      product_id: "SF118",
      model_name: "Roma Sofa",
      fabric_color: "Charcoal Grey",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785883/118_blfmi7.png",
    },
    {
      product_id: "SF119",
      model_name: "Roma Sofa",
      fabric_color: "Slate Blue",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785882/119_zrrtr0.png",
    },
    {
      product_id: "SF120",
      model_name: "Roma Sofa",
      fabric_color: "Deep Blue",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772785882/120_rsezhb.png",
    },
    {
      product_id: "SAM-01",
      model_name: "Samara Sofa",
      fabric_color: "Soft Ivory Beige",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772821744/01_mpygqa.png",
    },
    {
      product_id: "SAM-02",
      model_name: "Samara Sofa",
      fabric_color: "Light Mocha Beige",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772821743/02_n8qw1p.png",
    },
    {
      product_id: "SAM-03",
      model_name: "Samara Sofa",
      fabric_color: "Dark Chocolate Brown",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772821744/03_2_wqwfcn.png",
    },
    {
      product_id: "SAM-04",
      model_name: "Samara Sofa",
      fabric_color: "Warm Tan",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772821744/04_eh7b0a.png",
    },
    {
      product_id: "SAM-05",
      model_name: "Samara Sofa",
      fabric_color: "Mauve Taupe Brown",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772821745/05_o4adqd.png",
    },
    {
      product_id: "SAM-06",
      model_name: "Samara Sofa",
      fabric_color: "Taupe Brown",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772821745/06_omjhqk.png",
    },
    {
      product_id: "SAM-07",
      model_name: "Samara Sofa",
      fabric_color: "Burnt Orange",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772821751/07_doqz9y.png",
    },
    {
      product_id: "SAM-08",
      model_name: "Samara Sofa",
      fabric_color: "Dusty Rose",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772821749/08_ytazrd.png",
    },
    {
      product_id: "SAM-09",
      model_name: "Samara Sofa",
      fabric_color: "Terracotta",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772821748/09_j9xhib.png",
    },
    {
      product_id: "SAM-10",
      model_name: "Samara Sofa",
      fabric_color: "Turquoise",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772821749/10_qinyya.png",
    },
    {
      product_id: "SAM-11",
      model_name: "Samara Sofa",
      fabric_color: "Teal Blue",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772821749/11_xqnhxm.png",
    },
    {
      product_id: "SAM-12",
      model_name: "Samara Sofa",
      fabric_color: "Light Blue Grey",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772821749/12_kqydh6.png",
    },
    {
      product_id: "SAM-13",
      model_name: "Samara Sofa",
      fabric_color: "Light Grey Beige",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772821749/13_fwhgqp.png",
    },
    {
      product_id: "PIC-201",
      model_name: "Picasso Print",
      fabric_color: "Classic Beige Floral",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826971/201_jlpely.png",
    },
    {
      product_id: "PIC-202",
      model_name: "Picasso Print",
      fabric_color: "Beige Ornamental",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826971/202_gzytq2.png",
    },
    {
      product_id: "PIC-203",
      model_name: "Picasso Print",
      fabric_color: "Brown Abstract",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826971/203_e3wdfo.png",
    },
    {
      product_id: "PIC-204",
      model_name: "Picasso Print",
      fabric_color: "Dark Brown Pattern",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826971/204_llo6hb.png",
    },
    {
      product_id: "PIC-205",
      model_name: "Picasso Print",
      fabric_color: "Beige Patchwork",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826986/205_pf5ftx.png",
    },
    {
      product_id: "PIC-206",
      model_name: "Picasso Print",
      fabric_color: "Brown Swirl Pattern",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826972/206_opoy3p.png",
    },
    {
      product_id: "PIC-207",
      model_name: "Picasso Print",
      fabric_color: "Golden Floral",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826974/207_vht5hu.png",
    },
    {
      product_id: "PIC-208",
      model_name: "Picasso Print",
      fabric_color: "Soft Beige Floral",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826979/208_sozvng.png",
    },
    {
      product_id: "PIC-209",
      model_name: "Picasso Print",
      fabric_color: "Brown Geometric",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826978/209_qznupr.png",
    },
    {
      product_id: "PIC-210",
      model_name: "Picasso Print",
      fabric_color: "Maroon Triangle",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826982/210_hnkemm.png",
    },
    {
      product_id: "PIC-211",
      model_name: "Picasso Print",
      fabric_color: "Beige Traditional",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826980/211_nqqcie.png",
    },
    {
      product_id: "PIC-212",
      model_name: "Picasso Print",
      fabric_color: "Brown Mosaic",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826980/212_x8uu5x.png",
    },
    {
      product_id: "PIC-213",
      model_name: "Picasso Print",
      fabric_color: "Grey Geometric",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826982/213_tjsqvv.png",
    },
    {
      product_id: "PIC-214",
      model_name: "Picasso Print",
      fabric_color: "Black leaf pattern",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826982/213_tjsqvv.png",
    },
    {
      product_id: "PIC-215",
      model_name: "Picasso Print",
      fabric_color: "Black white floral",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826981/214_hdxord.png",
    },
    {
      product_id: "PIC-216",
      model_name: "Picasso Print",
      fabric_color: "Grey Linear",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826983/215_fbmmnt.png",
    },
    {
      product_id: "PIC-217",
      model_name: "Picasso Print",
      fabric_color: "Brown Leaf Pattern",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826983/216_fymxd3.png",
    },
    {
      product_id: "PIC-218",
      model_name: "Picasso Print",
      fabric_color: "Blue Floral",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826983/217_xhoegu.png",
    },
    {
      product_id: "PIC-219",
      model_name: "Picasso Print",
      fabric_color: "Blue Yellow Triangle",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826985/218_irks05.png",
    },
    {
      product_id: "PIC-220",
      model_name: "Picasso Print",
      fabric_color: "Blue Stripe",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826987/219_egphi2.png",
    },
    {
      product_id: "PIC-221",
      model_name: "Picasso Print",
      fabric_color: "Blue Botanic",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826985/220_wovpvw.png",
    },
    {
      product_id: "PIC-222",
      model_name: "Picasso Print",
      fabric_color: "Black Yellow Chevron",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826986/221_tz6yim.png",
    },
    {
      product_id: "PIC-223",
      model_name: "Picasso Print",
      fabric_color: "Teal Geometric",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826986/222_djrif9.png",
    },
    {
      product_id: "PIC-224",
      model_name: "Picasso Print",
      fabric_color: "Orange Blue Abstract",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826988/223_ijasv0.png",
    },
    {
      product_id: "PIC-225",
      model_name: "Picasso Print",
      fabric_color: "Blue Beige Triangle",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826989/224_jyy6uv.png",
    },
    {
      product_id: "PIC-226",
      model_name: "Picasso Print",
      fabric_color: "Pink Floral",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772827004/228_rd3iuy.png",
    },
    {
      product_id: "PIC-227",
      model_name: "Picasso Print",
      fabric_color: "Light blue Floral Pattern",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826990/229_zoxvpf.png",
    },
    {
      product_id: "PIC-231",
      model_name: "Picasso Print",
      fabric_color: "Turquoise Floral Pattern",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826992/230_hiwo75.png",
    },
    {
      product_id: "PIC-232",
      model_name: "Picasso Print",
      fabric_color: "Yellow Pink Floral",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826995/231_dgivdq.png",
    },
    {
      product_id: "PIC-233",
      model_name: "Picasso Print",
      fabric_color: "Black Gold Floral",
      made_to_order: "Yes",
      main_image:
        "https://res.cloudinary.com/dssuvfovt/image/upload/v1772826997/233_tmpww8.png",
    },
    {
  product_id: "LT101",
  model_name: "Lotus Plain",
  fabric_color: "Light blue",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881155/101.png_p8mmez.png",
},
{
  product_id: "LT102",
  model_name: "Lotus Plain",
  fabric_color: "Sage Green",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881190/102_xd1kmu.png",
},
{
  product_id: "LT103",
  model_name: "Lotus Plain",
  fabric_color: " White",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881191/103_f9mohv.png",
},
{
  product_id: "LT104",
  model_name: "Lotus Plain",
  fabric_color: "Light Grey",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881203/104_grjxg6.png",
},
{
  product_id: "LT105",
  model_name: "Lotus Plain",
  fabric_color: "Beige",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881195/105_dbynxh.png",
},
{
  product_id: "LT106",
  model_name: "Lotus Plain",
  fabric_color: "Dark grey",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881191/106_lrkpoq.png",
},
{
  product_id: "LT107",
  model_name: "Lotus Plain",
  fabric_color: "Teal Blue",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881193/107_l1k7pg.png",
},
{
  product_id: "LT108",
  model_name: "Lotus Plain",
  fabric_color: "Cyan Blue",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881195/108_v0kd47.png",
},
{
  product_id: "LT109",
  model_name: "Lotus Plain",
  fabric_color: "Teal Green",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881193/109_dhqypk.png",
},
{
  product_id: "LT110",
  model_name: "Lotus Plain",
  fabric_color: "Mustard Yellow",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881194/110_dk7oc3.png",
},
{
  product_id: "LT111",
  model_name: "Lotus Plain",
  fabric_color: "Blush Pink",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881194/111_torshq.png",
},
{
  product_id: "LT112",
  model_name: "Lotus Plain",
  fabric_color: "Sand Beige",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881195/112_jxo5pc.png",
},
{
  product_id: "LT113",
  model_name: "Lotus Plain",
  fabric_color: "Brown",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881195/113_ubwpdm.png",
},
{
  product_id: "LT114",
  model_name: "Lotus Plain",
fabric_color: "Taupe-Grey",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881197/114_nxihya.png",
},
{
  product_id: "LT115",
  model_name: "Lotus Plain",
  fabric_color: "Plum Purple",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881196/115_nmghg2.png",
},
{
  product_id: "LT116",
  model_name: "Lotus Plain",
  fabric_color: "Denim Blue",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881154/116_aab6mm.png",
},
{
  product_id: "LT117",
  model_name: "Lotus Plain",
  fabric_color: "Royal Blue",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881197/117_xqtuz8.png",
},
{
  product_id: "LT118",
  model_name: "Lotus Plain",
  fabric_color: "Dark Green",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881198/118_xld6jq.png",
},
{
  product_id: "LT119",
  model_name: "Lotus Plain",
  fabric_color: "charcoal",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881198/119_tuwbbb.png",
},
{
  product_id: "LT120",
  model_name: "Lotus Plain",
  fabric_color: "red",
  main_image: "https://res.cloudinary.com/dsvnjjgmd/image/upload/v1772881200/120_nevqqb.png",
},
  ];
  

  const openProductPage = (item) => {
    navigate(`/sofa-cover/${item.product_id}`, { state: item });
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <p style={styles.label}>SOFA COLLECTION</p>
        <h1 style={styles.title}>Premium Sofa</h1>
        <p style={styles.subtitle}>
          Elegant made-to-order sofa designs from your product sheet
        </p>
      </div>

      <div style={styles.grid}>
        {sofaData.map((item, index) => (
          <motion.div
            key={item.product_id || index}
            style={styles.card}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.28 }}
          >
            <div style={styles.imageContainer}>
              <img
                src={item.main_image}
                alt={`${item.model_name} ${item.fabric_color}`}
                style={styles.image}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </div>

            <div style={styles.cardBody}>
              <h3 style={styles.productName}>
                {item.model_name} - {item.fabric_color}
              </h3>

              <div style={styles.tag}>
                {item.made_to_order === "Yes" ? "Made To Order" : "Ready Stock"}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                style={styles.button}
                type="button"
                onClick={() => openProductPage(item)}
              >
                Pre-Book Now
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    background: "#f8f5f2",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  label: {
    fontSize: "12px",
    letterSpacing: "3px",
    color: "#9b7b66",
    fontWeight: "600",
    marginBottom: "8px",
  },
  title: {
    fontSize: "40px",
    margin: "10px 0",
    color: "#2f241f",
    fontWeight: "700",
  },
  subtitle: {
    color: "#6d5a4f",
    fontSize: "16px",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "28px",
  },
  card: {
    background: "#fff",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    cursor: "pointer",
  },
  imageContainer: {
    width: "100%",
    height: "320px",
    overflow: "hidden",
    background: "#f2ece7",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  cardBody: {
    padding: "24px",
  },
  productName: {
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 14px",
    color: "#3a2e28",
    lineHeight: "1.35",
  },
  tag: {
    display: "inline-block",
    padding: "8px 16px",
    fontSize: "13px",
    borderRadius: "999px",
    background: "#efe7df",
    color: "#6d4b3a",
    marginBottom: "18px",
    fontWeight: "500",
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#6b442f",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
  },
}; 