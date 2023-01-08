import { h, Fragment, createComponent, useState, useEffect } from '@dark-engine/core';
import { View, Text, TouchableOpacity, Image, ScrollView } from '@dark-engine/platform-native';

const App = createComponent(() => {
  const [count, setCount] = useState(0);

  return (
    <View padding={8}>
      <Text> count is: {count}</Text>
      <Image
        width='100%'
        height={400}
        stretch='aspectFill'
        src='https://images.unsplash.com/photo-1611915387288-fd8d2f5f928b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80'
      />
      <TouchableOpacity onPress={() => setCount(x => x + 1)}>
        <View padding={8} backgroundColor='blue'>
          <Text color='#fff' textAlignment='center' textTransform='uppercase'>
            Hello {count}
          </Text>
        </View>
      </TouchableOpacity>
      <ScrollView>
        <Text textWrap>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum eum debitis nemo unde neque pariatur
          repudiandae temporibus, magnam, accusantium ipsa doloribus ad veritatis. Dolorem consectetur officiis, enim
          natus non minus. Quisquam excepturi, a quas debitis maxime consequatur accusamus numquam inventore quis
          adipisci dolores vel nisi voluptatem sed tenetur, voluptas iste dolore atque ratione temporibus aut suscipit
          magni, quidem sunt. Harum eligendi aut architecto ullam veniam iste expedita omnis illo vero ipsum eum, itaque
          similique molestias quidem modi officiis repellendus labore. Deserunt illo quis perferendis tenetur, autem
          optio nisi quae possimus sit, voluptatem necessitatibus iusto ipsa? Minima vero temporibus illum libero odio,
          explicabo nisi laboriosam eum nostrum fuga asperiores reiciendis ad sunt! Molestiae cum sequi ipsum iure nobis
          iusto corrupti ad quidem repudiandae nemo magni soluta, non id odit quia omnis sint. Veritatis amet quae
          possimus repellat illo inventore perferendis dolores consequatur incidunt similique labore molestias veniam,
          quia distinctio optio harum accusamus maiores eos sit iusto! Quibusdam repellat asperiores natus dicta
          expedita doloremque minima, quis at corporis provident iste consequatur atque commodi iusto harum. Quibusdam,
          eum. Tempore deserunt quo, eius labore recusandae quam. Optio provident aut corrupti facere reprehenderit
          atque exercitationem ex aliquam beatae voluptatem, reiciendis similique consectetur vitae dolorum quis
          accusamus tempora itaque? Laudantium nihil, ab sequi fugiat quibusdam autem perspiciatis error laboriosam
          nesciunt dolores sed quod deleniti ipsum! Accusamus laboriosam ducimus quis natus, exercitationem quidem
          nesciunt quasi blanditiis rerum placeat quam sunt, iste consequatur doloremque odit cumque magni architecto
          dolorum voluptatem inventore. Ratione dolorum, quasi libero officia facilis delectus suscipit praesentium
          aliquam dignissimos deleniti hic voluptatibus animi ut! Nihil quo corporis qui quis, facere dolore! Quisquam
          eveniet dolore quae quasi? Ullam, perspiciatis ab provident velit qui numquam hic temporibus totam deserunt
          sint eos fugit corporis, pariatur, alias commodi sit? Corporis, dolor architecto. Esse ipsa, facere
          reprehenderit eaque deserunt velit. Sed accusamus mollitia eos ab maxime quo provident tenetur praesentium
          blanditiis libero dicta, reprehenderit doloremque alias, iure ex! Minus, quos optio aut id similique hic
          quibusdam placeat inventore ad harum esse nihil praesentium vel atque, sint obcaecati non at ratione sunt
          laboriosam nisi quis. Id consequatur illo ad quod totam sequi quaerat aspernatur autem, mollitia magnam iste
          unde officiis laudantium, exercitationem cum accusamus minima dicta facere similique a dolores dolorem velit
          error? Ut, odit repudiandae fugit magnam error consequatur eum suscipit culpa beatae non dolore quam esse
          minima voluptate aliquid neque magni officiis. Illo fugiat voluptate laborum debitis tempora, veritatis
          temporibus nihil obcaecati aperiam dolores dolor in molestiae repudiandae rem ex officiis aliquam libero
          doloremque distinctio maxime accusantium fuga harum inventore officia. Eius facilis vel reprehenderit omnis
          esse aliquid neque explicabo nulla ipsam? Cupiditate totam corporis fuga tempora voluptatem nam quo
          repellendus earum porro tenetur ipsam mollitia veritatis nemo sequi asperiores explicabo, corrupti, tempore
          debitis nihil quis odio architecto unde. Officiis aspernatur doloribus qui commodi? Nostrum inventore et velit
          eligendi quas nam placeat, ipsam ex reprehenderit sint quod. Doloremque, veniam veritatis. Quibusdam impedit
          fuga earum harum omnis, asperiores distinctio? Repellat, maxime possimus! Tempora perferendis quasi, libero
          doloremque quisquam repellat voluptatum!
        </Text>
      </ScrollView>
    </View>
  );
});

const Router = createComponent(() => {
  return (
    <frame>
      <page actionBarHidden>
        <stack-layout>
          <App />
        </stack-layout>
      </page>
    </frame>
  );
});

export default Router;
