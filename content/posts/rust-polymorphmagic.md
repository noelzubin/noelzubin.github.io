---
  title: "Rust PolymorphMagic"
  date: 2021-05-04T15:15:04+05:30
  tags: "code"
  tranding: false
  readTime: "3 min"
  thumbnail: /images/blog/crab.svg
#   featureImage: /images/blog/feature-image-06.jpg
---


Rust stands out for its impressive ability to provide zero-cost abstractions, a
feature that ensures developers don't have to sacrifice performance for advanced
functionality. This aspect of Rust becomes even more apparent when exploring the
actix-web library. The  library allows developers to build powerful web
applications with amazing flexibility and performance. But what catches most
developers eye is how bewilderingly flexible the api is. Here is a little taste of
what the api look like.

```rust
// this function takes 1 arg, and returns a string
async fn one_param(path: Path<NameStruct>) -> String {
    format!("Hello {}!", path.name)
}

// this function takes 2 args, and returns json 
async fn two_params(data: web::Data<AppState>, body: web::Json<Info>) -> impl Responder {
    let count = data.count.get();
    body
}

// But all the function are registered the same way. But how ?
App::new()
    .route("/no-param", web::get().to(|| async { "Hello there!" }))
    .route("/one-param/{name}", web::get().to(one_param))
    .route("/two/", web::get().to(web::post().to(two_param)))
```

The `to` function takes as input a function that can not only take any number of arguments, but it also injects into the arguments - the right values based on its type upon invocation. For a language that lacks polymorphism, or functions with variable arity, this seems like an impossible pattern. In this post, I’ll attempt to decipher and recreate this fascinating pattern.

I’ll create a Bakery library. A bakery has a supermarket assigned to it, and it takes in orders to create delicious goods out of the things it bought from the supermarket. The final API would look something like this.

```rust
    let mut bakery = Bakery::new();

    bakery.order(|_: Banana| Banana); // 1 arg, Makes a banana
    bakery.order(|_: Chocolate, _: Milk| Cookie); // 2 args, Makes a cookie

    bakery.process()
```

Before we start with the implementation, let’s get some basic things out of the way. In Actix-web the arguments of the handler function have to implement `fromRequest` and the response have to implment `HttpResponse`. In my case I came up with `Buyable` and `Eatable`. `Buyable`s are things you buy from a supermarket and `Eatable`s are things that are produced in the bakery.

```rust
struct Chocolate; // Buyable
struct Milk; // Buyable
struct Banana; // Buyable + Eatable (uhhh they're reselling bananas ?)
struct Cookie; // Eatable

trait Buyable { // can be bought from the supermarket
    fn buy(store: Supermarket) -> Self;
}

trait Eatable: std::fmt::Debug { // made in the bakery
    fn eat(&mut self) {
        println!("eating");
    }
}


// The Buyables
impl Buyable for Chocolate {
    fn buy(_store: Supermarket) -> Chocolate {
        Chocolate
    }
}

impl Buyable for Milk {
    fn buy(_store: Supermarket) -> Milk {
        Milk
    }
}

impl Buyable for Banana {
    fn buy(_store: Supermarket) -> Banana {
        Banana
    }
}

// The Eatables
impl Eatable for Cookie {}
impl Eatable for Banana {}
```

lets start with our Bakery implementation then. It has a supermarket assigned to it and also a `Vec` of our orders. But how do we tell Rust that ?. Our handlers are distinct functions with different signatures.

```rust
struct Supermarket {} // we can buy stuff from here.

struct Bakery {
    store: Supermarket,
    orders: Vec< ??? OUR HANDLERS ??? >>,
}
```

We clearly need to `trait` these handlers into one. Furthermore, what would the input for our order function be ?

```rust
impl Bakery {
    fn order(&mut self, f: ?? WHAT GOES HERE ?? ) {
        ...
    }
}
```

Hmm, OK let’s see if I can characterize all the functions with a trait.

```rust
trait Handler<Args, E> {
    fn call(&self, args: ...Args) -> E
}
```

Cool, except rust doesn’t support `...Args`. I have to specify the exact number of function arguments.

Wait, How does Actix do it then ????.
 Actix has a main `Service` trait. ` async fn(Request) -> Result<Response, Err> `
Which isn't surprising. This looks like an everyday request handler. So how does
it convert all the handlers we write into this service trait ?.   

This is the
smart bit. There are 2 parts to it. Firstly, the `call` method in the Actix
`Handler` doesn't have multiple args. Instead takes a single arg `Arg`. Then it
implements [`Handler` for functions of different
airities](https://github.com/actix/actix-web/blob/05b4c4964f2b26e44bc1cd95409ef92018f59fd8/actix-web/src/handler.rs#L134-L149),
the arguments are converted into a single argument which is a tuple of all the
arguments passed into the function. Secondly the [`FromRequest` trait is
implemented for tuple of all
sizes](https://github.com/actix/actix-web/blob/215a52f56535a8ab104159c84d02461841d5d340/actix-web/src/extract.rs#L319).
Now we can convert the [`Handler`s into
`Service`](https://github.com/actix/actix-web/blob/05b4c4964f2b26e44bc1cd95409ef92018f59fd8/actix-web/src/handler.rs#L99-L124)
by simply converting the request to a `FromRequest` tuple that can be invoked by
the handler function to return the result. Following the same pattern for our
bakery. We need implement our `Handler` for functions of different airities, Also we need to implement `Buyable` for tuples of different sizes too.   
```rust
trait Handler<Args, E> {
    fn call(&self, args: Args) -> E;
}

// Implement Buyable for tuples.
impl<Arg1> Buyable for (Arg1,)
where
    Arg1: Buyable,
{
    fn buy(store: Supermarket) -> (Arg1,) {
        (Buyable::buy(store),)
    }
}

impl<Arg1, Arg2> Buyable for (Arg1, Arg2)
where
    Arg1: Buyable,
    Arg2: Buyable,
{
    fn buy(store: Supermarket) -> (Arg1, Arg2) {
        (Buyable::buy(store), Buyable::buy(store))
    }
}

trait Handler<Args, E> {
    fn call(&self, args: Args) -> E;
}

// For Functions with single argument
impl<F, Arg1, E> Handler<(Arg1,), E> for F
where
    F: Fn(Arg1) -> E,
    Arg1: Buyable,
    E: Eatable,
{
    fn call(&self, (arg1,): (Arg1,)) -> E {
        self(arg1)
    }
}

// For functions with 2 arguments
impl<F, Arg1, Arg2, E> Handler<(Arg1, Arg2), E> for F
where
    F: Fn(Arg1, Arg2) -> E,
    Arg1: Buyable,
    Arg2: Buyable,
    E: Eatable,
{
    fn call(&self, (arg1, arg2): (Arg1, Arg2)) -> E {
        self(arg1, arg2)
    }
}

```

Now we can finally write our `order` function. Which simply invokes `self.call` on the `Handler` passed into it with the right tuple of arguments.
``` rust
/// Supermarket sells stuff to bake with.
#[derive(Clone, Copy)]
struct Supermarket {}

// ...

/// MAIN APP STUFF
/// Bakery buys stuff from the supermarket and makes Eatables
struct Bakery {
    store: Supermarket,
    orders: Vec<Box<dyn FnOnce() -> Box<dyn Eatable>>>, // stores the wrapped handlers.
}

impl Bakery {
    fn new() -> Self {
        // create a empty
        Bakery {
            store: Supermarket {},
            orders: Vec::new(),
        }
    }

    fn order<F, Args, E>(&mut self, f: F)
    where
        F: Handler<Args, E> + 'static,
        Args: Buyable,
        E: Eatable + 'static,
    {
        let store = self.store;
        let ff = move || {
            // The main magic happens here. Rust compiler ensures that
            // the tuple is generated with the right arguments to be 
            // passsed to the handler.
            let args = Buyable::buy(store); // Creates a tuple of n elements.
            let eatable: Box<dyn Eatable> = Box::new(f.call(args)); 
            eatable
        };
        self.orders.push(Box::new(ff));
    }

    // process just calls the vector of wrapped orders.
    fn process(self) {
        dbg!(self.orders.into_iter().map(|f| { f() }).collect::<Vec<_>>());
    }
}

fn main() {
    let mut bakery = Bakery::new();

    bakery.order(|_: Chocolate, _: Milk| Cookie);
    bakery.order(|_: Banana| Banana);

    bakery.process()
}
```

Right now, this code only supports functions with a max arity of 2. But you can easily allow functions with more arity by implementing the corresponding `Handler` and `Buyable` traits. In the actix-web library, it supports up to 12 arities, and it makes use of declarative macros in rust to implement the trait for all the different function signatures.

Working out this pattern in rust was very amusing, and it is pretty amazing how the rust compiler can compile an eccentric pattern like this. Also kudos to whoever implemented this in the actix-web library.
