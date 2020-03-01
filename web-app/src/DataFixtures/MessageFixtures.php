<?php

namespace App\DataFixtures;

use App\Entity\Message;
use App\Entity\User;
use App\Security\Encoder\MessageEncoderInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class MessageFixtures extends Fixture implements DependentFixtureInterface
{
    /**
     * @var MessageEncoderInterface
     */
    private MessageEncoderInterface $messageEncoder;

    public function __construct(MessageEncoderInterface $messageEncoder)
    {
        $this->messageEncoder = $messageEncoder;
    }

    /**
     * @inheritDoc
     * @throws \Exception
     */
    public function load(ObjectManager $manager): void
    {
        $t = 'Hello there!';
        for ($i = 0; $i < 10; $i++) {
            $text = str_pad($t, mt_rand(strlen($t), strlen($t) * 2), ' Some here');
            /** @var User $user */
            $user = $this->getReference(constant(sprintf('%s::USER_%d', UserFixtures::class, mt_rand(1, 3))));
            $m = (new Message())
                ->setMessage($this->messageEncoder->encodeMessage($text))
                ->setCreatedAt(new \DateTimeImmutable(sprintf('-%d hour', mt_rand(1, 36))));

            $m->setUser($user);

            $manager->persist($m);
        }

        $manager->flush();
    }

    /**
     * @inheritDoc
     */
    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}