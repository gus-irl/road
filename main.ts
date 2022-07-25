let hero = game.createSprite(2, 3)
basic.showString("L", 15)
basic.showString("O", 15)
basic.showString("O", 15)
basic.showString("K", 15)
basic.showString("O", 15)
basic.showString("U", 15)
basic.showString("T", 15)
basic.showLeds(`
    # # # # #
    # # # # #
    # # # # #
    # # . # #
    # # # # #
`, 100)
function road_flash(plot_x: number, plot_x2: number, plot_y: number) {
    led.plotBrightness(plot_x, plot_y, 70)
    led.plotBrightness(plot_x2, plot_y, 70)
    basic.pause(20)
    led.plotBrightness(plot_x, plot_y, 50)
    led.plotBrightness(plot_x2, plot_y, 50)
}

control.inBackground(function car_loop() {
    let frequency: number;
    while (true) {
        frequency = randint(100, 1000)
        control.inBackground(function spawn_car() {
            let column: number;
            let car: game.LedSprite;
            column = randint(1, 3)
            car = game.createSprite(column, 0)
            car.set(LedSpriteProperty.Brightness, 50)
            while (car.y() < 4) {
                basic.pause(300)
                //  Checks to make sure there is still room to squeeze through
                if (hero.y() == car.y() + 1) {
                    car.changeYBy(1)
                } else if (column == 2) {
                    if (!led.point(car.x() - 1, car.y() + 1) && !led.point(car.x() + 1, car.y() + 1)) {
                        car.changeYBy(1)
                    }
                    
                } else if (!led.point(car.x(), car.y() + 1)) {
                    car.changeYBy(1)
                }
                
                if (hero.isTouching(car)) {
                    basic.pause(300)
                    game.gameOver()
                    //  Crashes here, 020 code ? Works fine in emulator
                    break
                }
                
            }
            basic.pause(300)
            car.delete()
            game.setScore(game.score() + 1)
        })
        basic.pause(frequency)
    }
})
basic.forever(function on_forever() {
    if (input.acceleration(Dimension.X) > 200) {
        hero.setX(3)
    } else if (input.acceleration(Dimension.X) < -200) {
        hero.setX(1)
    } else {
        hero.setX(2)
    }
    
})
basic.forever(function road_animation() {
    if (!game.isGameOver()) {
        for (let y = 0; y < 5; y++) {
            road_flash(0, 4, y)
        }
    }
    
})
