const puppeteer = require('puppeteer');
const fs = require('fs');

const urls = [
    'https://www.julieseatsandtreats.com/shrimp-boil/',
    'https://www.loveandlemons.com/baked-potato/',
    'https://www.servingdumplings.com/recipe/marry-me-shrimp-pasta/',
    'https://wishbonekitchen.com/red-wine-braised-beef-short-ribs/',
    'https://pinchofyum.com/chicken-pot-pie-with-biscuits',
    'https://orsararecipes.net/spaghetti-shrimp-scampi-recipe?fbclid=IwZXh0bgNhZW0CMTEAAR2l8LAy3b280V-vyxDbp_kWNx-Fmpgc97Fx2ueWjo3go5A1OeA4nI_NxbM_aem_NsMtFPLVwRjV5A-EgkylCQ',
    'https://www.spendwithpennies.com/classic-green-bean-casserole/',
    'https://tastesbetterfromscratch.com/sweet-potato-casserole/',
    'https://buuckfarmsbakery.com/pumpkin-butter-snickerdoodles/',
    'https://www.twopeasandtheirpod.com/chicken-caesar-wrap/',
    'https://www.foodandwine.com/recipes/red-skin-potato-mash',
    'https://cookingformysoul.com/dutch-oven-pot-roast/',
    'https://www.culinaryhill.com/chipotle-burrito-bowl-recipe/',
    'https://www.glutenfreepalate.com/easy-gluten-free-chocolate-cake-11-ingredients/',
    'https://www.food.com/recipe/easy-moist-banana-blueberry-muffins-153642',
    'https://www.savorynothings.com/mediterranean-baked-cod/',
    'https://www.culinaryhill.com/classic-tuna-salad-sandwich/',
    'https://feelgoodfoodie.net/recipe/ground-beef-tacos-napa-cabbage-guacamole/',
    'https://www.culinaryhill.com/turkey-meatballs/',
    'https://www.freshoffthegrid.com/pulled-pork-sliders/',
    'https://damndelicious.net/2012/05/30/teriyaki-salmon-with-sriracha-cream-sauce/',
    'https://www.spendwithpennies.com/sweet-potato-casserole/',
    'https://www.dessertfortwo.com/sweet-potato-casserole-marshmallows/',
    'https://www.allrecipes.com/recipe/18379/best-green-bean-casserole/',
    'https://thefoodcharlatan.com/creamed-corn-casserole/',
    'https://pin.it/6Chldr4',
    'https://www.halfbakedharvest.com/pumpkin-butter-cinnamon-roll-bread/',
    'https://www.halfbakedharvest.com/pumpkin-butter-chocolate-chip-cookies/',
    'https://carlsbadcravings.com/slow-cooker-beef-stew-recipe/',
    'https://damndelicious.net/2023/04/21/best-chicken-caesar-salad-with-homemade-croutons/',
    'https://www.allrecipes.com/recipe/16706/banana-pumpkin-bread/',
    'https://sallysbakingaddiction.com/iced-pumpkin-coffee-cake/',
    'https://www.delish.com/cooking/recipe-ideas/a30615986/slow-cooker-chicken-tinga-tacos-recipe/',
    'https://www.ambitiouskitchen.com/seriously-the-best-healthy-turkey-chili/',
    'https://www.spendwithpennies.com/greek-tzatziki-yogurt-cucumber-dip/',
    'https://www.spendwithpennies.com/greek-chicken-kabobs/',
    'https://www.eatingwell.com/recipe/274851/sheet-pan-chicken-fajita-bowls/',
    'https://www.eatingwell.com/recipe/269822/easy-chicken-meatballs/',
    'https://www.eatingwell.com/recipe/269824/minestra-maritata-italian-wedding-soup/',
    'https://www.themediterraneandish.com/rice-tuna-bowls/',
    'https://www.eataly.com/us_en/magazine/recipes/pasta-recipes/vesuvio-pasta-sausage',
    'https://www.themediterraneandish.com/ladolemono-greek-salad-dressing/',
    'https://www.spendwithpennies.com/easy-italian-salad/',
    'https://www.spendwithpennies.com/crock-pot-pork-chops/',
    'https://www.spendwithpennies.com/cheesy-bean-burritos-freezer-friendly/',
    'https://www.halfbakedharvest.com/chicken-tzatziki-salad-wraps/',
    'https://cooking.nytimes.com/recipes/1018078-steak-fajitas',
    'https://www.delish.com/cooking/recipe-ideas/recipes/a48559/italian-club-recipe/',
    'https://www.halfbakedharvest.com/chicken-gyros-with-feta-tzatziki/?fbclid=PAAaauhBA8zJOUH3imTqOyw2CKA45N59GHEAnji_AwW56cJ03L-K48sbqSS40',
    'https://www.spendwithpennies.com/pasta-fagioli-soup-recipe/',
    'https://www.spendwithpennies.com/crock-pot-chicken-and-dumplings/',
    'https://www.howsweeteats.com/2021/02/chicken-meatball-pitas/',
    'https://www.howsweeteats.com/2021/01/pork-milanese/',
    'https://www.cookingclassy.com/california-roll-sushi-bowls/',
    'https://www.fooddolls.com/shorbet-lesan-el-asfour/',
    'https://cooking.nytimes.com/recipes/1019905-slow-cooker-white-chicken-chili',
    'https://www.allrecipes.com/recipe/16352/slow-cooker-beef-stroganoff-i/',
    'https://cooking.nytimes.com/recipes/12177-fried-rice',
    'https://www.allrecipes.com/recipe/13107/miso-soup/',
    'https://www.thewholesomedish.com/the-best-classic-chili/',
    'https://www.realsimple.com/food-recipes/browse-all-recipes/turkey-vegetable-soup',
    'https://www.spendwithpennies.com/baked-ziti/',
    'https://www.budgetbytes.com/vegetable-barley-soup/',
    'https://www.themodernnonna.com/the-best-chicken-soup-ever/',
    'https://amindfullmom.com/ramen-recipe/',
    'https://www.halfbakedharvest.com/white-bean-lemon-pesto-orzo-soup/',
    'https://www.halfbakedharvest.com/chicken-and-avocado-ranch-salad-wraps/',
    'https://www.halfbakedharvest.com/brown-butter-lobster-pasta/',
    'https://www.halfbakedharvest.com/zucchini-banana-muffins/',
    'https://www.gimmesomeoven.com/baked-potato/',
    'https://www.loveandlemons.com/pasta-salad/',
    'https://www.halfbakedharvest.com/sheet-pan-greek-meatballs/',
    'https://www.recipetineats.com/beef-stroganoff/',
    'https://www.cookingclassy.com/teriyaki-chicken/',
    'https://www.allrecipes.com/recipe/127491/easy-oreo-truffles/',
    'https://www.recipetineats.com/slow-cooked-shredded-beef-ragu-pasta/',
    'https://natashaskitchen.com/chimichurri-sauce-recipe/',
    'https://natashaskitchen.com/pan-seared-steak/',
    'https://cooking.nytimes.com/recipes/1016869-baked-potatoes',
    'https://thesaltymarshmallow.com/lemon-pepper-baked-chicken-thighs/',
    'https://www.halfbakedharvest.com/sheet-pan-lemon-chicken/',
    'https://www.halfbakedharvest.com/roasted-tomato-basil-and-feta-orzo/',
    'https://www.halfbakedharvest.com/chicken-tzatziki-bowls/'
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const results = [];

  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      const data = await page.evaluate(() => {
        const getTextList = (selector) =>
          [...document.querySelectorAll(selector)]
            .map((el) => el.innerText.trim())
            .filter(Boolean);

        const title = document.querySelector('h1')?.innerText || '';
        const ingredients = getTextList('[class*=ingredient], [id*=ingredient]');
        const instructions = getTextList('[class*=instruction], [id*=instruction], ol li');
        
        // Extract image from meta tags or main image
        let image = '';
        
        // Try to get image from meta tags first
        const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
        if (ogImage) {
          image = ogImage;
        } else {
          // Try to get the first large image on the page
          const mainImage = document.querySelector('img[src*="recipe"], img[src*="food"], img[src*="dish"], img[src*="meal"]');
          if (mainImage) {
            image = mainImage.src;
          }
        }

        return {
          title,
          ingredients,
          instructions,
          image
        };
      });

      results.push({ url, ...data });
      console.log(`✅ Scraped: ${url}`);
    } catch (err) {
      console.warn(`❌ Failed: ${url}\n   Reason: ${err.message}`);
    }
  }

  await browser.close();

  fs.writeFileSync('recipes.json', JSON.stringify(results, null, 2));
})();
