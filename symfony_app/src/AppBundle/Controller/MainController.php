<?php
/**
 * Created by PhpStorm.
 * User: KMax
 * Date: 14.02.2016
 * Time: 13:57
 */
namespace AppBundle\Controller;

use AppBundle\Entity\Auth;
use AppBundle\Entity\Chat;
use AppBundle\Service\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;

Class MainController extends Controller
{
    /**
     * @Route ("/", name="_home")
     * @param Request $request
     * @return RedirectResponse | Response
     */
    public function homeAction(Request $request)
    {
        $session = $request->getSession();
        $userId = $session->get('userId');
        $login = $session->get('login');

        if ($session->get('isLogged') && $userId) {
            $em = $this->getDoctrine()
                ->getRepository('AppBundle:Chat');

            $lastMessages = $em->createQueryBuilder('c')
                ->select('u.userName, c.msgTime, c.message, c.color')
                ->join('AppBundle:Auth', 'u', 'WITH', 'u.id = c.fromUser')
                ->orderBy('c.id', 'DESC')
                ->setMaxResults(20)
                ->getQuery()
                ->getResult();

            krsort($lastMessages);

            return $this->render('chat.twig',
                [
                    'pageName' => 'Home Page',
                    'userName' => $login,
                    'messages' => $lastMessages,
                    'userId' => $userId
                ]
            );
        } else {
            return $this->redirectToRoute('_login');
        }
    }

    /**
     * @Route ("/save_msg", name="_saveMsg")
     * @param Request $request
     * @return Response
     */
    public function saveMsgAction(Request $request)
    {
        $session = $request->getSession();
        $userId = $session->get('userId');
        $userService = $this->container->get('user_service');

        $postData = $request->request->all();

        if ($userId != $postData['userId']
            || !$userService->checkIsUserExists($postData['userId'])
        ) {
            return new JsonResponse([
                'status' => false ,
                'error' => 'Auth error!Try to re-login'
            ]);
        }

        $postData['message'] = htmlspecialchars(
            $postData['message'],
            ENT_NOQUOTES
        );

        $postData['message'] = trim($postData['message']);

        if ($postData['message']) {
            $saveMsg = new Chat();
            $saveMsg->setFromUser($userId);
            $saveMsg->setMsgTime(new \DateTime($postData['time']));
            $saveMsg->setMessage($postData['message']);
            $saveMsg->setColor($postData['color']);

            $em = $this->getDoctrine()->getManager();
            $em->persist($saveMsg);
            $em->flush();
            return new Response('Message saved');
        } else {
            return new Response('Message is empty');
        }
    }
}