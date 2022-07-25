hero = game.create_sprite(2, 3)

basic.show_string("L", 15)
basic.show_string("O", 15)
basic.show_string("O", 15)
basic.show_string("K", 15)
basic.show_string("O", 15)
basic.show_string("U", 15)
basic.show_string("T", 15)
basic.show_leds("""
    # # # # #
    # # # # #
    # # # # #
    # # . # #
    # # # # #
""", 100)


def road_flash(plot_x: number, plot_x2: number, plot_y: number):
    led.plot_brightness(plot_x, plot_y, 70)
    led.plot_brightness(plot_x2, plot_y, 70)
    basic.pause(20)
    led.plot_brightness(plot_x, plot_y, 50)
    led.plot_brightness(plot_x2, plot_y, 50)

def road_animation():
    if not game.is_game_over():
        for y in range(5):
            road_flash(0, 4, y)

def spawn_car():
    column = randint(1, 3)
    car = game.create_sprite(column, 0)
    
    car.set(LedSpriteProperty.BRIGHTNESS, 50)
    while car.y() < 4:
        basic.pause(300)
        # Checks to make sure there is still room to squeeze through
        if hero.y() == car.y() + 1:
            car.change_yby(1)
        elif column == 2:
            if not led.point(car.x() - 1, car.y() + 1) and not led.point(car.x() + 1, car.y() + 1):
                car.change_yby(1)
        elif not led.point(car.x(),car.y() + 1):
            car.change_yby(1)

        if hero.is_touching(car):
            basic.pause(300)
            game.game_over() # Crashes here, 020 code ? Works fine in emulator
            break

    basic.pause(300)
    car.delete()
    game.set_score(game.score() + 1)

def car_loop():
    while True:
        frequency = randint(100, 1000)
        control.in_background(spawn_car)
        basic.pause(frequency)

control.in_background(car_loop)

def on_forever():
    if input.acceleration(Dimension.X) > 200:
        hero.set_x(3)
    elif input.acceleration(Dimension.X) < -200:
        hero.set_x(1)
    else:
        hero.set_x(2)

basic.forever(on_forever)
basic.forever(road_animation)